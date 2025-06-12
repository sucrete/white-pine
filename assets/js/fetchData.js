console.log("fetchData attached");
  const sanityQuery =
        "https://5vgxmbfr.api.sanity.io/v2025-06-12/data/query/production?query=%7B%27events%27%3A*%5B_type+%3D%3D+%27event%27%5D%2C%27images%27%3A*%5B_type+%3D%3D+%22sanity.imageAsset%22%5D%7D&perspective=published";

async function fetchData() {
  try {
    const response = await fetch(sanityQuery);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();
    // console.log("%cfetch successful ", "color:chartreuse;background: black");
    console.log("%cfetch successful ", "color:chartreuse;background: black", data, data.result);
    return data.result;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
