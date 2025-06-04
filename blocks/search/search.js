export default function decorate(block) {
  block.innerHTML = `
    <form id="search-form">
      <input type="text" id="search-input" placeholder="Search..." />
      <button type="submit">Search</button>
    </form>
    <ul id="search-results"></ul>
  `;

  const form = block.querySelector("#search-form");
  const input = block.querySelector("#search-input");
  const resultsList = block.querySelector("#search-results");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    const requestBody = {
      query: {
        match: {
          content: query,
        },
      },
    };
    resultsList.innerHTML = "<li>Loading...</li>";
    try {
      const res = await fetch(
        "http://os-ser-Publi-TMp9AlFevoF8-1740363461.us-east-1.elb.amazonaws.com/_search",
        {
          // Dev ALB URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "<Insert API key here>",
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();

      const hits = data.hits?.hits || [];
      if (hits.length === 0) {
        resultsList.innerHTML = "<li>No results found.</li>";
        return;
      }

      resultsList.innerHTML = "";

      hits.forEach((hit) => {
        const { title, url } = hit._source;

        const titleLi = document.createElement("li");
        titleLi.textContent = title;

        const urlUl = document.createElement("ul");
        const urlLi = document.createElement("li");
        const link = document.createElement("a");
        link.href = url;
        link.textContent = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        urlLi.appendChild(link);
        urlUl.appendChild(urlLi);

        resultsList.appendChild(titleLi);
        resultsList.appendChild(urlUl);
        resultsList.appendChild(document.createElement("br"));
      });
    } catch (error) {
      resultsList.innerHTML = `<li>Error: ${error.message}</li>`;
    }
  });
}
