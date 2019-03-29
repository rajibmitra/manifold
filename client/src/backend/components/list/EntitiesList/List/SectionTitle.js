import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isNil from "lodash/isNil";
import { Link } from "react-router-dom";

export default class ListEntitiesListSectionTitle extends PureComponent {
  static displayName = "List.Entities.List.SectionTitle";

  static propTypes = {
    title: PropTypes.node,
    titleLink: PropTypes.string,
    titleIcon: PropTypes.string,
    count: PropTypes.node
  };

  get count() {
    return this.props.count;
  }

  get hasCount() {
    return !isNil(this.count);
  }

  get title() {
    const { title } = this.props;
    if (this.hasCount) return `${this.count} ${title}`;
    return title;
  }

  get titleLink() {
    return this.props.titleLink;
  }

  link(child) {
    if (!this.titleLink) return child;
    return <Link to={this.titleLink}>{child}</Link>;
  }

  render() {
    return (
      <header className="entity-list__title backend-header section-heading-tertiary">
        {this.link(
          <h2>
            <span className="section-heading-tertiary__shim">{this.title}</span>
          </h2>
        )}
      </header>
    );
  }
}
