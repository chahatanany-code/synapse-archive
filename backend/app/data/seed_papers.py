from typing import List, Dict, Any

SEED_DOCUMENTS: List[Dict[str, Any]] = [
    {
        "document_id": "doc_attention_is_all_you_need",
        "title": "Attention Is All You Need",
        "authors": ["Ashish Vaswani", "Noam Shazeer", "Niki Parmar", "Jakob Uszkoreit", "Llion Jones", "Aidan N. Gomez", "Lukasz Kaiser", "Illia Polosukhin"],
        "source": "NeurIPS 2017",
        "page_count": 11,
        "topic": "Transformers & Attention",
        "pages": [
            {
                "page_number": 1,
                "sections": [
                    (
                        "Abstract",
                        "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train."
                    ),
                    (
                        "1. Introduction",
                        "Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in sequence modeling. Recurrent models inherently factor computation along the symbol positions of the input and output sequences. Aligning the positions to steps in computation time, they generate a sequence of hidden states h_t, as a function of the previous hidden state h_{t-1} and the input for position t. This inherently sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths, as memory constraints limit batching across examples."
                    )
                ]
            },
            {
                "page_number": 3,
                "sections": [
                    (
                        "3.1 Scaled Dot-Product Attention",
                        "An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key. We compute the attention function on a set of queries simultaneously, packed together into a matrix Q. The keys and values are also packed into matrices K and V. We compute the matrix of outputs as: Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V. We compute scaled dot-product attention because for large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions that have extremely small gradients."
                    ),
                    (
                        "3.2 Multi-Head Attention",
                        "Instead of performing a single attention function with d_model-dimensional queries, keys and values, we found it beneficial to linearly project the queries, keys and values h times with different, learned linear projections to d_k, d_k and d_v dimensions, respectively. Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions. With a single attention head, averaging inhibits this. MultiHead(Q, K, V) = Concat(head_1, ..., head_h) W^O where head_i = Attention(Q W_i^Q, K W_i^K, V W_i^V)."
                    )
                ]
            },
            {
                "page_number": 5,
                "sections": [
                    (
                        "3.5 Positional Encoding",
                        "Since our model contains no recurrence and no convolution, in order for the model to make use of the order of the sequence, we must inject some information about the relative or absolute position of the tokens in the sequence. To this end, we add 'positional encodings' to the input embeddings at the bottoms of the encoder and decoder stacks. In this work, we use sine and cosine functions of different frequencies: PE_{(pos, 2i)} = sin(pos / 10000^{2i/d_model}) and PE_{(pos, 2i+1)} = cos(pos / 10000^{2i/d_model}). We chose this sinusoidal version because we hypothesized it would allow the model to easily learn to attend by relative positions."
                    )
                ]
            }
        ]
    },
    {
        "document_id": "doc_bert_pretraining",
        "title": "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
        "authors": ["Jacob Devlin", "Ming-Wei Chang", "Kenton Lee", "Kristina Toutanova"],
        "source": "NAACL-HLT 2019",
        "page_count": 16,
        "topic": "Pre-trained Language Models",
        "pages": [
            {
                "page_number": 1,
                "sections": [
                    (
                        "Abstract",
                        "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers. As a result, the pre-trained BERT model can be fine-tuned with just one additional output layer to create state-of-the-art models for a wide range of tasks, such as question answering and language inference, without substantial task-specific architecture modifications."
                    ),
                    (
                        "1. Introduction",
                        "Language model pre-training has been shown to be effective for improving many natural language processing tasks. However, standard language models are unidirectional, and this limits the choice of architectures during pre-training. In this paper, we propose BERT: Bidirectional Encoder Representations from Transformers. BERT alleviates the previously mentioned unidirectionality constraint by using a 'masked language model' (MLM) pre-training objective. The masked language model randomly masks some of the tokens from the input, and the objective is to predict the original vocabulary id of the masked word based only on its context."
                    )
                ]
            },
            {
                "page_number": 3,
                "sections": [
                    (
                        "3.1 Task 1: Masked LM",
                        "Intuitively, it is reasonable to believe that a deep bidirectional model is strictly more powerful than either a left-to-right model or the shallow concatenation of a left-to-right and a right-to-left model. Unfortunately, standard conditional language models can only be trained left-to-right or right-to-left, since bidirectional conditioning would allow each word to indirectly 'see itself' in a multi-layered context. In order to train a deep bidirectional representation, we simply mask a certain percentage of the input tokens at random, and then predict those masked tokens. In all of our experiments, we mask 15% of all WordPiece tokens in each sequence at random."
                    ),
                    (
                        "3.2 Task 2: Next Sentence Prediction (NSP)",
                        "Many important downstream tasks such as Question Answering (QA) and Natural Language Inference (NLI) are based on understanding the relationship between two sentences, which is not directly captured by language modeling. In order to train a model that understands sentence relationships, we pre-train for a binarized next sentence prediction task that can be trivially generated from any monolingual corpus. Specifically, when choosing the sentences A and B for each pre-training example, 50% of the time B is the actual next sentence that follows A, and 50% of the time it is a random sentence from the corpus."
                    )
                ]
            }
        ]
    },
    {
        "document_id": "doc_deep_residual_learning",
        "title": "Deep Residual Learning for Image Recognition",
        "authors": ["Kaiming He", "Xiangyu Zhang", "Shaoqing Ren", "Jian Sun"],
        "source": "CVPR 2016",
        "page_count": 12,
        "topic": "Computer Vision & ResNet",
        "pages": [
            {
                "page_number": 1,
                "sections": [
                    (
                        "Abstract",
                        "Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions. We provide comprehensive empirical evidence showing that these residual networks are easier to optimize, and can gain accuracy from considerably increased depth. On the ImageNet dataset we evaluate residual nets with a depth of up to 152 layers—8x deeper than VGG nets but still having lower complexity."
                    ),
                    (
                        "1. Introduction",
                        "When deeper networks are able to start converging, a degradation problem has been exposed: with the network depth increasing, accuracy becomes saturated and then degrades rapidly. Unexpectedly, such degradation is not caused by overfitting, and adding more layers to a suitably deep model leads to higher training error. The degradation of training accuracy indicates that not all systems are similarly easy to optimize. Let us consider a shallower architecture and its deeper counterpart that adds more layers onto it. There exists a solution by construction: the added layers are identity mapping, and the other layers are copied from the learned shallower model."
                    )
                ]
            },
            {
                "page_number": 3,
                "sections": [
                    (
                        "3. Deep Residual Learning",
                        "Instead of hoping each few stacked layers directly fit a desired underlying mapping H(x), we explicitly let these layers fit a residual mapping F(x) := H(x) - x. The original mapping is recast into F(x) + x. We hypothesize that it is easier to optimize the residual mapping than to optimize the original, unreferenced mapping. To the extreme, if an identity mapping were optimal, it would be easier to push the residual to zero than to fit an identity mapping by a stack of nonlinear layers. The formulation of F(x) + x can be realized by feedforward neural networks with 'shortcut connections'. Shortcut connections are those skipping one or more layers. In our case, the shortcut connections simply perform identity mapping, and their outputs are added to the outputs of the stacked layers. Identity shortcut connections add neither extra parameter nor computation complexity."
                    )
                ]
            }
        ]
    },
    {
        "document_id": "doc_lora_adaptation",
        "title": "LoRA: Low-Rank Adaptation of Large Language Models",
        "authors": ["Edward J. Hu", "Yelong Shen", "Phillip Wallis", "Zeyuan Allen-Zhu", "Yuanzhi Li", "Shean Wang", "Lu Wang", "Weizhu Chen"],
        "source": "ICLR 2022",
        "page_count": 14,
        "topic": "Parameter-Efficient Fine-Tuning",
        "pages": [
            {
                "page_number": 1,
                "sections": [
                    (
                        "Abstract",
                        "An important paradigm of natural language processing consists of large-scale pre-training on general domain data and adaptation to particular tasks or domains. As we pre-train larger models, full fine-tuning, which retrains all model parameters, becomes less feasible. We propose Low-Rank Adaptation, or LoRA, which freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture, greatly reducing the number of trainable parameters for downstream tasks. Compared to fine-tuning with GPT-3 175B, LoRA can reduce the number of trainable parameters by 10,000 times and the GPU memory requirement by 3 times."
                    ),
                    (
                        "1. Introduction & Motivation",
                        "Many applications in natural language processing rely on adapting one large, pre-trained language model to multiple downstream applications. The major downside for full fine-tuning is that the new model contains as many parameters as the original model. If we need to fine-tune a 175B parameter GPT-3 model for dozens of tasks, storing and deploying independent instances of 175B parameters is prohibitively expensive. We take inspiration from Aghajanyan et al. (2020) which shows that the learned over-parametrized models in fact reside on a low intrinsic dimension. We hypothesize the updates to the weights also have a low 'intrinsic rank' during adaptation."
                    )
                ]
            },
            {
                "page_number": 3,
                "sections": [
                    (
                        "4. Method: Low-Rank Parameterized Update Matrices",
                        "For a pre-trained weight matrix W_0 in R^{d x k}, we constrain its update by representing the latter with a low-rank decomposition: W_0 + Delta W = W_0 + B A, where B in R^{d x r}, A in R^{r x k}, and the rank r << min(d, k). During training, W_0 is frozen and does not receive gradient updates, while A and B contain trainable parameters. Note that both W_0 and Delta W = B A are multiplied to the same input x, and their respective output vectors are summed coordinate-wise: h = W_0 x + Delta W x = W_0 x + B A x. We use a random Gaussian initialization for A and zero for B, so Delta W = B A is zero at the beginning of training."
                    )
                ]
            }
        ]
    },
    {
        "document_id": "doc_retrieval_augmented_generation",
        "title": "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
        "authors": ["Patrick Lewis", "Ethan Perez", "Aleksandra Piktus", "Fabio Petroni", "Vladimir Karpukhin", "Naman Goyal", "Heinrich Küttler", "Mike Lewis", "Wen-tau Yih", "Tim Rocktäschel", "Sebastian Riedel", "Douwe Kiela"],
        "source": "NeurIPS 2020",
        "page_count": 19,
        "topic": "Information Retrieval & RAG",
        "pages": [
            {
                "page_number": 1,
                "sections": [
                    (
                        "Abstract",
                        "Large pre-trained language models have been shown to store factual knowledge in their parameters, and achieve state-of-the-art results when fine-tuned on downstream NLP tasks. However, their ability to access and precisely manipulate knowledge is still limited, and they struggle on knowledge-intensive tasks. In this work, we develop a general-purpose fine-tuning recipe for retrieval-augmented generation (RAG) — models which combine pre-trained parametric and non-parametric memory for language generation. We introduce RAG models where the parametric memory is a pre-trained seq2seq model and the non-parametric memory is a dense vector index of Wikipedia, accessed with a pre-trained neural retriever."
                    ),
                    (
                        "1. Introduction",
                        "Pre-trained neural language models learn a substantial amount of in-depth world knowledge from data. Despite these successes, such models have drawbacks: they cannot easily expand or revise their memory, can struggle to produce non-hallucinatory facts, and cannot explain the provenance of their generations. Hybrid models that combine parametric memory with non-parametric (retrieval-based) memories can address some of these issues, because knowledge can be directly revised and expanded, and accessed knowledge can be inspected. We bring together parametric and non-parametric components in an end-to-end framework, coupling a neural retriever (Dense Passage Retriever) with an autoregressive generator (BART)."
                    )
                ]
            },
            {
                "page_number": 4,
                "sections": [
                    (
                        "2. Methods: Dense Passage Retrieval and Generator",
                        "RAG models use the input sequence x to retrieve text passages z and use them as additional context when generating the target sequence y. The retriever p_eta(z|x) is based on Dense Passage Retrieval (DPR). The DPR retrieval model uses a dual-encoder architecture: a passage encoder producing d-dimensional vectors and a query encoder. The similarity between query x and passage z is defined by the dot product of their dense vectors: score(x, z) = q(x)^T d(z). The top-k passages with the highest prior probability are retrieved using Maximum Inner Product Search (MIPS). The generator p_theta(y_i | x, z, y_{1:i-1}) can be any autoregressive sequence-to-sequence model."
                    )
                ]
            }
        ]
    },
    {
        "document_id": "doc_generative_adversarial_nets",
        "title": "Generative Adversarial Nets",
        "authors": ["Ian J. Goodfellow", "Jean Pouget-Abadie", "Mehdi Mirza", "Bing Xu", "David Warde-Farley", "Sherjil Ozair", "Aaron Courville", "Yoshua Bengio"],
        "source": "NeurIPS 2014",
        "page_count": 9,
        "topic": "Generative Modeling & Game Theory",
        "pages": [
            {
                "page_number": 1,
                "sections": [
                    (
                        "Abstract",
                        "We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G. The training procedure for G is to maximize the probability of D making a mistake. This framework corresponds to a minimax two-player game. In the space of arbitrary functions G and D, a unique solution exists, with G recovering the training data distribution and D equal to 1/2 everywhere."
                    ),
                    (
                        "3. Adversarial Nets Formulation",
                        "The adversarial modeling framework is most straightforward to apply when the models are both multilayer perceptrons. To learn the generator's distribution p_g over data x, we define a prior on input noise variables p_z(z), then represent a mapping to data space as G(z; theta_g). We also define a second multilayer perceptron D(x; theta_d) that outputs a single scalar. D(x) represents the probability that x came from the data rather than p_g. We train D to maximize the probability of assigning the correct label to both training examples and samples from G. We simultaneously train G to minimize log(1 - D(G(z))): min_G max_D V(D, G) = E_{x~p_data}[log D(x)] + E_{z~p_z}[log(1 - D(G(z)))]."
                    )
                ]
            }
        ]
    }
]
