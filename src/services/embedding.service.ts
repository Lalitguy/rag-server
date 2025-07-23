async function query(data: {
  inputs: {
    source_sentence: string;
    sentences: string[];
  };
}) {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/sentence-similarity",
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

query({
  inputs: {
    source_sentence: "That is a happy person",
    sentences: [
      "That is a happy dog",
      "That is a very happy person",
      "Today is a sunny day",
    ],
  },
}).then((response) => {
  console.log(JSON.stringify(response));
});

export const embedText = () => {};
