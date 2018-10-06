import React from 'react';
import './main.scss';

export class Main extends React.Component {

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <main role="main" className="pf-l-page__main">

        <section className="pf-l-page__main-section pf-m-light">
          <div className="pf-c-content">
            <h1>Syndesis Reacts</h1>
            <p>
              Body text should be Overpass Regular at 16px. It should have leading of 24px because
              <br /> of it’s relative line height of 1.5.
            </p>
          </div>

          <p className="pf-c-content">
            <a href="#">link</a>
            <br/>
            <button className="pf-c-button pf-m-link">button</button>
          </p>
        </section>

        <section className="pf-l-page__main-section">
          {this.props.children}
        </section>

      </main>
    );
  }
}
