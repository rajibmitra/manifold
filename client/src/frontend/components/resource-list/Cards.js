import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Resource from "frontend/components/resource";
import Meta from "global/components/meta";
import Utility from "global/components/utility";

export default class ResourceListCards extends PureComponent {
  static displayName = "ResourceList.Cards";

  static propTypes = {
    resourceCollection: PropTypes.object,
    resources: PropTypes.array.isRequired,
    project: PropTypes.object.isRequired,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func
  };

  render() {
    if (!this.props.resources) return null;
    const project = this.props.project;

    return (
      <div>
        <nav className="resource-list">
          <div className="resource-count">
            <Utility.EntityCount
              pagination={this.props.pagination}
              singularUnit={"resource"}
              pluralUnit={"resources"}
            />
            {project ? (
              <Meta.DOI
                doi={project.attributes.metadataFormatted.resourcesDoi}
              />
            ) : null}
          </div>
          <ul>
            {this.props.resources.map(resource => {
              return (
                <Resource.Card
                  resourceCollection={this.props.resourceCollection}
                  key={resource.id}
                  resource={resource}
                  project={this.props.project}
                />
              );
            })}
          </ul>
          {this.props.pagination ? (
            <Utility.Pagination
              paginationClickHandler={this.props.paginationClickHandler}
              pagination={this.props.pagination}
            />
          ) : null}
        </nav>
      </div>
    );
  }
}
