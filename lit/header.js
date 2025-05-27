import { LitElement, html } from "../../assets/js/vendor/lit.js";

export class Header extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="header-four-wrapper">
              <div class="nav-area">
                <nav>
                  <ul class="parent-nav">
                    <li>
                      <a class="nav-link" href="calendar.html">Calendar</a>
                    </li>
                    <li>
                      <a class="nav-link" href="contact.html">Contact</a>
                    </li>
                  </ul>
                </nav>
              </div>
              <div class="button-area-right-header">
                <div class="menu-btn-toggle">
                  <svg
                    width="20"
                    height="16"
                    viewBox="0 0 20 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect y="14" width="20" height="2" fill="#1F1F25"></rect>
                    <rect y="7" width="20" height="2" fill="#1F1F25"></rect>
                    <rect width="20" height="2" fill="#1F1F25"></rect>
                  </svg>
                </div>
              </div>
              <a href="index.html" class="logo">
                <img
                  src="/assets/images/logo/white-pine.svg"
                  alt=""
                  class="white-pine-badge"
                />
                <img
                  src="/assets/images/logo/white-pine-offset.svg"
                  alt=""
                  class="white-pine-offset injectable"
                />
                <img
                  src="/assets/images/logo/white-pine-coarse-2.svg"
                  alt=""
                  class="white-pine-logo-roman injectable"
                />
                <img
                  src="/assets/images/logo/lone-pine.svg"
                  alt=""
                  class="white-pine-logo-stag injectable"
                />
              </a>
              <div class="nav-area">
                <nav>
                  <ul class="parent-nav">
                    <!-- <li>
                      <a class="nav-link" href="events.html"
                        >Events</a
                      >
                    </li>
                    <li>
                      <a class="nav-link" href="contact.html"> Contact </a>
                    </li> -->
                    <li>
                      <a
                        href="book-tee-time.html"
                        class="rts-btn btn-primary my-btn book-tee-time-btn"
                      >
                        Book Tee Time
                        <img
                          class="injectable"
                          src="assets/images/service/icons/13.svg"
                          alt=""
                        />
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define("my-header", Header);
