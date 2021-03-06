import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";
import Utility from "global/components/utility";
import lh from "helpers/linkHandler";

export default class Chip extends PureComponent {
  static displayName = "Project.Hero.Builder.ActionCallouts.Chip";

  static propTypes = {
    actionCallout: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    history: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
  };

  onEdit = event => {
    event.preventDefault();
    return this.props.history.push(
      lh.link("backendProjectActionCalloutEdit", this.projectId, this.id),
      { noScroll: true }
    );
  };

  get projectId() {
    return this.props.project.id;
  }

  get title() {
    return this.props.actionCallout.attributes.title;
  }

  get id() {
    return this.props.actionCallout.id;
  }

  get index() {
    return this.props.index;
  }

  render() {
    return (
      <Draggable
        index={this.index}
        draggableId={this.id}
        key={this.id}
        type="actionCallout"
      >
        {provided => (
          <React.Fragment>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              className="action-callout-slot__chip"
            >
              <div className="action-callout-slot__chip-inner">
                <span className="action-callout-slot__chip-title">
                  {this.title}
                </span>
                <span className="action-callout-slot__chip-utility">
                  <button
                    onClick={this.onEdit}
                    type="button"
                    className="action-callout-slot__button"
                  >
                    <Utility.IconComposer icon="annotate32" size={24} />
                  </button>
                  <div
                    className="action-callout-slot__button action-callout-slot__button--draggable"
                    {...provided.dragHandleProps}
                  >
                    <Utility.IconComposer icon="grabber32" size={24} />
                  </div>
                </span>
              </div>
            </div>
            {provided.placeholder}
          </React.Fragment>
        )}
      </Draggable>
    );
  }
}
