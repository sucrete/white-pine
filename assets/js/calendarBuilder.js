document.addEventListener("DOMContentLoaded", function () {
  var cal = document.getElementById("calendar");
  // var myModal = document.getElementById("calModal");
  var modalTitle = document.getElementsByClassName("modal-title")[0];
  var modalBody = document.getElementsByClassName("modal-body")[0];
  var modalDate = document.getElementsByClassName("modal-date")[0];
  var modalDateEnd = document.getElementsByClassName("modal-date-end")[0];
  var modalBodyWrapper =
    document.getElementsByClassName("modal-body-wrapper")[0];
  var modalFooter = document.getElementsByClassName("modal-footer")[0];

  var modalAttachment = document.getElementsByClassName("modal-attachment")[0];
  var modalLink = document.getElementsByClassName("modal-link")[0];

  //~ fetch data
  fetchData().then((data) => {
    //~ create custom view
    const { sliceEvents, createPlugin } = FullCalendar;
    const CustomViewConfig = {
      classNames: ["custom-view"],
      content: function (props) {
        let segs = sliceEvents(props, true); // allDay=true
        console.log("segs", segs);
        console.log("segs.length < 0", segs.length > 0);
        console.log("segs[0].def", segs[0]?.def);
        let html =
          segs.length > 0
            ? ` <div class="events-list-wrapper d-flex flex-column-reverse">
                  ${segs
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
                     <div class="event-list-footer d-flex flex-row ${(seg.def.extendedProps.linkQuestion || seg.def.extendedProps.flyerQuestion) ? "" : "no-buttons"}">
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
            : `<div class="no-events-message"><img class="no-events-icon injectable" src="assets/images/icons/no-events.svg"/>No events for this period</div>`;

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
      headerToolbar: {
        left: "dayGridMonth,monthList",
        center: "title",
        right: "today prev,next",
      },
      views: {
        monthList: {
          buttonText: "list",
          duration: {
            months: 1,
          },
          // contentHeight: '500px',
          height: 'unset',
        },
      },
      initialView: "dayGridMonth",
      events: data.events,

      eventClick: function (info) {
        //~Modal
        // ➡️ add title
        modalTitle.textContent = info.event.title;

        // ➡️ add start date
        modalDate.textContent = moment(info.event.start).format(
          "dddd, MMMM Do"
        );
        // ➡️ add event description
        modalBody.textContent = info.event.extendedProps.eventDescription;

        // ➡️ check if there is an event end and if not remove any formally set .textContent
        if (info.event.end) {
          modalDateEnd.textContent =
            " - " +
            moment(info.event.end).subtract(1, "days").format("dddd, MMMM Do");
        } else {
          modalDateEnd.textContent = "";
        }

        // ➡️  check if there is an attachment AND a link
        if (
          info.event.extendedProps.flyerQuestion ||
          info.event.extendedProps.linkQuestion
        ) {
          modalFooter.style = "display: flex";
          modalBodyWrapper.style = "padding-bottom: 1rem";
          // ➡️ if there is a flyer, search for it and attach it to the View Flyer button...
          if (info.event.extendedProps.flyerQuestion) {
            modalAttachment.style = "display:flex";
            var imageAssetObject = data.images.find(
              (image) => image._id === info.event.extendedProps.flyer.asset._ref
            );
            modalAttachment.href = imageAssetObject.url;
          } else {
            // ...otherwise delete the button
            modalAttachment.style = "display:none";
          }
          // ➡️  if there is a registration link, search for it and attach it to the View Flyer button...
          if (info.event.extendedProps.linkQuestion) {
            modalLink.style = "display:flex";
            modalLink.href = info.event.extendedProps.linkDeets.linkURL;
          } else {
            // ...otherwise delete the button
            modalLink.style = "display:none";
          }
        } else {
          modalFooter.style = "display: none";
          modalBodyWrapper.style = "padding-bottom: 4rem";
        }

        $("#calModal").modal("show");
      },
    });
    calendar.render();
  });
});
