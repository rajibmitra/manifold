import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Project from "frontend/components/project";
import { entityStoreActions } from "actions";
import { grab } from "utils/entityUtils";
import { projectsAPI, requests } from "api";
import { Redirect } from "react-router-dom";
import get from "lodash/get";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";

import withSettings from "hoc/with-settings";

const { request, flush } = entityStoreActions;

export class ProjectDetailContainer extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const projectRequest = request(
      projectsAPI.show(match.params.id),
      requests.feProject
    );
    const { promise: one } = dispatch(projectRequest);
    return Promise.all([one]);
  };

  static mapStateToProps = (state, ownProps) => {
    return {
      project: grab("projects", ownProps.match.params.id, state.entityStore),
      projectResponse: get(state.entityStore.responses, requests.feProject)
    };
  };

  static propTypes = {
    project: PropTypes.object,
    projectResponse: PropTypes.object,
    settings: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    fetchData: PropTypes.func
  };

  componentDidMount() {
    window.addEventListener("keyup", this.maybeReloadProject);
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.feProject));
    window.removeEventListener("keyup", this.maybeReloadProject);
  }

  maybeReloadProject = event => {
    // ctrl + r
    if (event.ctrlKey && event.keyCode === 82) {
      if (!this.props.fetchData) return;
      this.props.fetchData(this.props);
    }
  };

  render() {
    if (!this.props.projectResponse) return null;
    if (this.props.projectResponse.status === 401)
      return <Redirect to={lh.link("frontend")} />;
    const { project, settings } = this.props;
    if (!project) return null;

    return (
      <div className="project-detail">
        <HeadContent
          title={`\u201c${
            this.props.project.attributes.titlePlaintext
          }\u201d on ${settings.attributes.general.installationName}`}
          description={this.props.project.attributes.description}
          image={this.props.project.attributes.heroStyles.medium}
        />
        <Project.Detail
          project={this.props.project}
          dispatch={this.props.dispatch}
        />
      </div>
    );
  }
}

export default connectAndFetch(withSettings(ProjectDetailContainer));
