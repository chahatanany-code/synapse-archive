import io
import re
from typing import List, Dict, Any, Tuple
from pypdf import PdfReader

def extract_sections_from_text(text: str) -> List[Tuple[str, str]]:
    """
    Splits text into (section_title, section_body) tuples based on common academic headers.
    """
    lines = text.split("\n")
    sections: List[Tuple[str, str]] = []
    current_title = "Abstract / Introduction"
    current_lines: List[str] = []
    
    # Common academic section header patterns
    header_pattern = re.compile(r"^(\d+\.?\s+)?(ABSTRACT|INTRODUCTION|RELATED WORK|BACKGROUND|METHODOLOGY|MODEL ARCHITECTURE|ATTENTION MECHANISMS|EXPERIMENTS|RESULTS|DISCUSSION|CONCLUSION|REFERENCES)\b", re.IGNORECASE)

    for line in lines:
        stripped = line.strip()
        match = header_pattern.match(stripped)
        if match and len(stripped) < 70:
            if current_lines:
                sections.append((current_title, "\n".join(current_lines).strip()))
                current_lines = []
            current_title = stripped.title()
        else:
            current_lines.append(line)
            
    if current_lines:
        sections.append((current_title, "\n".join(current_lines).strip()))
        
    return sections if sections else [("Main Content", text)]

def parse_pdf(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Extracts text page-by-page from PDF with page numbering and section detection.
    """
    stream = io.BytesIO(file_bytes)
    reader = PdfReader(stream)
    pages_data = []
    full_text = ""
    
    for i, page in enumerate(reader.pages):
        page_num = i + 1
        page_text = page.extract_text() or ""
        # Clean hyphenated line breaks common in academic two-column PDFs
        page_text = re.sub(r"(\w+)-\n(\w+)", r"\1\2", page_text)
        page_text = re.sub(r"\n{3,}", "\n\n", page_text)
        
        sections = extract_sections_from_text(page_text)
        pages_data.append({
            "page_number": page_num,
            "text": page_text,
            "sections": sections
        })
        full_text += f"\n--- Page {page_num} ---\n" + page_text

    # Try to extract title from metadata or first page header
    doc_info = reader.metadata or {}
    title = doc_info.title if doc_info.title else filename.replace(".pdf", "").replace("_", " ").title()
    authors = [doc_info.author] if doc_info.author else []
    
    # If title is generic or missing, infer from first lines
    if title == filename or not title:
        first_lines = [l.strip() for l in pages_data[0]["text"].split("\n") if len(l.strip()) > 3]
        if first_lines:
            title = first_lines[0][:80]

    return {
        "title": title,
        "authors": authors,
        "page_count": len(reader.pages),
        "pages": pages_data,
        "full_text": full_text
    }

def parse_markdown(text: str, filename: str) -> Dict[str, Any]:
    """
    Parses Markdown documents preserving headers and structure.
    """
    sections: List[Tuple[str, str]] = []
    lines = text.split("\n")
    current_title = "Header / Overview"
    current_lines: List[str] = []
    title = filename.replace(".md", "").replace("_", " ").title()

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("#"):
            if current_lines:
                sections.append((current_title, "\n".join(current_lines).strip()))
                current_lines = []
            header_text = re.sub(r"^#+\s*", "", stripped)
            current_title = header_text
            if current_title and title == filename:
                title = current_title
        else:
            current_lines.append(line)
            
    if current_lines:
        sections.append((current_title, "\n".join(current_lines).strip()))

    pages_data = [{
        "page_number": 1,
        "text": text,
        "sections": sections
    }]

    return {
        "title": title,
        "authors": [],
        "page_count": 1,
        "pages": pages_data,
        "full_text": text
    }

def parse_txt(text: str, filename: str) -> Dict[str, Any]:
    sections = extract_sections_from_text(text)
    pages_data = [{
        "page_number": 1,
        "text": text,
        "sections": sections
    }]
    return {
        "title": filename.replace(".txt", "").replace("_", " ").title(),
        "authors": [],
        "page_count": 1,
        "pages": pages_data,
        "full_text": text
    }
