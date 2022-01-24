// dependencies / things imported
import { LitElement, html, css } from 'lit';
import { UserIP } from './UserIP.js';

export class LocationFromIP extends LitElement {
  static get tag() {
    return 'location-from-ip';
  }

  constructor() {
    super();
    this.UserIpInstance = new UserIP();
    this.locationEndpoint = 'https://freegeoip.app/json/';
    this.long = 10.305385;
    this.lat = 77.923029;
  }

  static get properties() {
    return {
      lat: { type: Number, reflect: true},
      long: { type: Number, reflect: true},
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.getGEOIPData();
  }
// where you get the longitude and latitude
  async getGEOIPData() {
    const IPClass = new UserIP();
    const userIPData = await IPClass.updateUserIP();
    return fetch(this.locationEndpoint + userIPData.ip)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then(data => {
        console.log(data);
        // no idea why the this. and the data. are switched but it seemed to work for my location
        this.lat = data.longitude;
        this.long = data.latitude
        return data;
      });
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        iframe {
          height: 500px;
          width: 500px;
        }
      `,
    ];
  }

  render() {
    // this function runs every time a properties() declared variable changes
    // this means you can make new variables and then bind them this way if you like
    console.log(`Rendering Coordinates: ${this.long} and ${this.lat}`);
    const url = `https://maps.google.com/maps?q=${this.long},${this.lat}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
   console.log(`URL: ${url}`)
    return html`<iframe title="Where you are" src="${url}"></iframe> `;
  }
}

customElements.define(LocationFromIP.tag, LocationFromIP);
