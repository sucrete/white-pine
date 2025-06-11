console.log("fetchData attached");
  const sanityQuery =
        "https://5vgxmbfr.api.sanity.io/v2025-06-11/data/query/production?query=*%5B_type+%3D%3D+%27event%27%5D%0A&perspective=published";

async function fetchData() {
  try {
    const response = await fetch(sanityQuery);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();
    console.log("%cfetch successful ", "color:chartreuse;background: black");
    console.log("%cfetch successful ", "color:chartreuse;background: black", data, data.result);
    return data.result;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
