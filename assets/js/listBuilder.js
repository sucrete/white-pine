const calendarQuery =
  "https://5vgxmbfr.api.sanity.io/v2025-06-12/data/query/production?query=%7B%27events%27%3A*%5B_type+%3D%3D+%27event%27%5D%2C%27images%27%3A*%5B_type+%3D%3D+%22sanity.imageAsset%22%5D%7D&perspective=published";

const todaysDate = new Date();
const futureDate = todaysDate.setMonth(todaysDate.getMonth() + 5);

document.addEventListener("DOMContentLoaded", function () {
  var cal = document.getElementById("events-list");

  //~ fetch data
  fetchData(calendarQuery).then((data) => {
    //~ create custom view
    const { sliceEvents, createPlugin } = FullCalendar;
    const CustomViewConfig = {
      classNames: ["custom-view"],
      content: function (props) {
        let segs = sliceEvents(props, true);
        const sortedSegs = segs.sort(
          (a, b) => new Date(b.range.start) - new Date(a.range.start)
        );
        console.log("sorted segs", sortedSegs);
        console.log("segs.length > 0?: ", segs.length > 0);
        console.log("segs[0].def", segs[0]?.def);
        let html =
          segs.length > 0
            ? ` <div class="events-list-wrapper d-flex flex-column-reverse">
                  ${sortedSegs
                    .slice(-3)
                    .map((seg) => {
                      return `
                  <div class="event-list-item">
                    <div class="event-list-title">${seg.def.title}</div>
                    <div class="event-list-date-wrapper d-flex flex-row align-items-center">
                     <img src="assets/images/icons/calendar.svg" class="date-icon" alt=""/>
                      <div class="event-list-date-start">
                        ${moment(seg.range.start)
                          .add(1, "days")
                          .format("dddd, MMMM Do")}
                      </div>
                      <div class="event-list-date-end">
                        ${
                          moment(seg.range.end).isAfter(
                            moment(seg.range.start).add(1, "days")
                          )
                            ? " - " +
                              moment(seg.range.end).format("dddd, MMMM Do")
                            : ""
                        }
                      </div>
                    </div>
                    <hr/>
                    <div class="event-list-description">
                      ${seg.def.extendedProps.eventDescription}
                    </div>
                     <div class="event-list-footer d-flex flex-row ${
                       seg.def.extendedProps.linkQuestion ||
                       seg.def.extendedProps.flyerQuestion
                         ? ""
                         : "no-buttons"
                     }">
                 ${
                   seg.def.extendedProps?.flyer
                     ? `<a href="${
                         data.images.find(
                           (image) =>
                             image._id ===
                             seg.def.extendedProps.flyer.asset._ref
                         ).url
                       }"
                  class="btn btn-secondary event-list-flyer-btn"
                  target="_blank"
                  >view flyer</a>`
                     : ""
                 }
                 ${
                   seg.def.extendedProps?.linkQuestion
                     ? `
                   <a
                  href="${seg.def.extendedProps.linkDeets.linkURL}"
                  class="btn btn-secondary event-list-link-btn"
                  target="_blank"
                  >${seg.def.extendedProps.linkDeets.linkText}</a
                >
                  `
                     : ""
                 }
              </div>
                  </div>
              `;
                    })
                    .join("")}
                </div>`
            : `<div class="no-events-message"><img class="no-events-icon injectable" src="assets/images/icons/no-events.svg"/>no events scheduled for this month</div>`;

        return { html: html };
      },
    };

    const CustomViewPlugin = createPlugin({
      views: {
        monthList: CustomViewConfig,
      },
    });
    console.log(
      `%c${JSON.stringify(data, null, 2)}`,
      "color: red; background: black"
    );

    //~ initialize Calendar
    var calendar = new FullCalendar.Calendar(cal, {
      plugins: [CustomViewPlugin],
      headerToolbar: false,
      views: {
        monthList: {
          // duration: {
          //   months: 1,
          // },
          visibleRange: {
            start: new Date(),
            end: futureDate,
          },
          height: "unset",
        },
      },
      initialView: "monthList",
      events: data.events,
    });
    calendar.render();
  });
});
