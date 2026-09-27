import uvicorn

if __name__ == "__main__":
    print("==================================================")
    print("  SYNAPSE ARCHIVE: Intelligent Academic Retrieval ")
    print("  Backend Server starting on http://127.0.0.1:8000 ")
    print("==================================================")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)
