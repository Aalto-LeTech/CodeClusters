CREATE TABLE model (
	model_id TEXT PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT NOT NULL
);

INSERT INTO model (model_id, title, description)
VALUES ('ngram', 'N-gram',
'Generic N-gram model, commonly used in NLP. Used also in program code similarity detection.

The submissions are parsed according to the chosen tokenset. The "modified" set are manually chosen keywords and statements, with control flow structure embedded in them with eg separate "IF {" and "} IF" tokens.

The "complete" tokenset is the full available language keywords, statements and expressions, as provided by the parser. The resulting clusters might be somewhat noisy compared to the "modified" set.

The "keyword" set are only the keywords of the language, with the non-descriptive tokens such as whitespace and brackets removed. Examples are "CLASS" or "DECIMAL_LITERAL". Full description of the all the tokensets can be found from the modeling repository''s source code.

From these tokens n-grams are generated. With a lower n, more of the lower-level features are captured, and with a higher n, the higher-level structures. You can select a range of used n-grams eg [1,5] which uses all 5 n-grams from 1 to 5, and combines their features into one. In general, a range of 3-6 is preferable, 1 will be suspectible to noise, and higher than 6 won''t really find many meaningful clusters. N-gram also does not consider the order of the features, unless they are specified by the tokens themselves eg "LOOP {".

After the features have been produced for each document, they are transformed into a TF-IDF matrix. The similarity between the document vectors is calculated by cosine similarity. The resulting distance matrix is then passed to the clustering algorithm of choice, although it might not make much difference which one is chosen if the features are poor. There won''t be any meaningful clusters to be found either way.

For the dimensionality visualization either t-SNE or UMAP can be used. For t-SNE dimensionality is done with truncated SVD, although with small datasets the results will look a lot alike. The SVD n-components have to be the size of the dataset or the size of the features at maximum. The UMAP should in theory stretch the points between the clusters a bit more, yet with small datasets the difference will not be very noticeable. Due to low size also the scale of the projection might vary highly, thus a random seed can be used to ensure the same result each time for the same features.
');
