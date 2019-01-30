import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Slot from "./Slot";
import { DragDropContext } from "react-beautiful-dnd";
import { actionCalloutsAPI, requests } from "api";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export default class ActionCallouts extends PureComponent {
  static displayName = "Project.Hero.Builder.ActionCallouts";

  static propTypes = {
    project: PropTypes.object.isRequired
  };

  static getDerivedStateFromProps(props, state) {
    if (props.actionCalloutsResponse === state.response) return null;

    const slotCallouts = ActionCallouts.slotActionCallouts(
      props.actionCallouts
    );
    return { slotCallouts, response: props.actionCalloutsResponse };
  }

  static slotActionCallouts(actionCallouts) {
    /* eslint-disable no-param-reassign */
    const out = Object.keys(ActionCallouts.slots).reduce((map, id) => {
      const attributes = ActionCallouts.slots[id].attributes;
      const compareKeys = Object.keys(attributes);
      map[id] = actionCallouts.filter(actionCallout =>
        compareKeys.every(compareKey => {
          const match =
            attributes[compareKey] === actionCallout.attributes[compareKey];
          return match;
        })
      );
      return map;
    }, {});
    return out;
    /* eslint-enable no-param-reassign */
  }

  static slots = {
    "left-button": {
      title: "Add button to left side",
      attributes: { location: "left", button: true }
    },
    "right-button": {
      title: "Add button to right side",
      attributes: { location: "right", button: true }
    },
    "left-link": {
      title: "Add link to left side",
      attributes: { location: "left", button: false }
    },
    "right-link": {
      title: "Add link to right side",
      attributes: { location: "right", button: false }
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      slotCallouts: ActionCallouts.slotActionCallouts(props.actionCallouts),
      response: props.actionCalloutsResponse
    };
  }

  onDragEnd = draggable => {
    if (!draggable.source || !draggable.destination) return;
    this.moveToSlot(
      draggable.draggableId,
      draggable.source.droppableId,
      draggable.destination.droppableId,
      draggable.destination.index
    );
    this.updateCallout(
      draggable.draggableId,
      draggable.destination.droppableId,
      draggable.destination.index
    );
  };

  onDragStart = () => {};

  get project() {
    return this.props.project;
  }

  get slotIds() {
    return Object.keys(ActionCallouts.slots);
  }

  updateCallout(id, slotId, index) {
    const baseAttributes = this.findSlot(slotId).attributes;
    const attributes = Object.assign({}, baseAttributes, {
      position: index === 0 ? "top" : index + 1
    });
    const call = actionCalloutsAPI.update(id, { attributes });
    const options = { noTouch: true };
    const updateRequest = request(
      call,
      requests.beActionCalloutUpdate,
      options
    );
    this.props
      .dispatch(updateRequest)
      .promise.then(this.props.refresh, this.props.refresh);
  }

  moveToSlot(id, sourceSlotId, destinationSlotId, destinationIndex) {
    const callout = this.removeFromSlot(id, sourceSlotId);
    this.addToSlot(callout, destinationSlotId, destinationIndex);
  }

  replaceSlotInState(slotId, slotCallouts) {
    const state = {
      slotCallouts: Object.assign({}, this.state.slotCallouts, {
        [slotId]: slotCallouts
      })
    };
    this.setState(state);
  }

  addToSlot(actionCallout, slotId, index) {
    const slotCallouts = this.state.slotCallouts[slotId].slice(0);
    slotCallouts.splice(index, 0, actionCallout);
    this.replaceSlotInState(slotId, slotCallouts);
  }

  removeFromSlot(id, slotId) {
    const slotCallouts = this.state.slotCallouts[slotId].slice(0);
    const index = slotCallouts.findIndex(ac => ac.id === id);
    const callout = slotCallouts.splice(index, 1)[0];
    this.replaceSlotInState(slotId, slotCallouts);
    return callout;
  }

  findSlot(slotId) {
    return ActionCallouts.slots[slotId];
  }

  actionCalloutsBySlot(slotId) {
    return this.state.slotCallouts[slotId];
  }

  render() {
    return (
      <div className="action-callouts">
        <DragDropContext
          onDragStart={this.onDragStart}
          onDragEnd={this.onDragEnd}
        >
          {this.slotIds.map(slotId => {
            return (
              <Slot
                key={slotId}
                id={slotId}
                {...this.findSlot(slotId)}
                project={this.project}
                actionCallouts={this.actionCalloutsBySlot(slotId)}
              />
            );
          })}
        </DragDropContext>
      </div>
    );
  }
}
