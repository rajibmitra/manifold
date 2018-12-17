import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import AvailableSection from "./sections/Available";
import CurrentSection from "./sections/Current";
import { projectsAPI } from "api";
import { DragDropContext } from "react-beautiful-dnd";
import Developer from "global/components/developer";
import cloneDeep from "lodash/cloneDeep";

// TODO: Remove this.
import fakeProject from "./temporary/fake-project";

export default class ProjectContent extends PureComponent {
  static displayName = "Project.Content";

  static propTypes = {
    project: PropTypes.object
  };

  static defaultProps = {
    // TODO: Remove this
    project: fakeProject
  };

  static getDerivedStateFromProps(props, state) {
    const updatedAt = props.project.attributes.updatedAt;
    if (updatedAt === state.updatedAt) return null;
    const blocks = cloneDeep(props.project.relationships.contentBlocks);
    return { blocks, updatedAt };
  }

  constructor(props) {
    super(props);

    this.state = {
      blocks: [],
      updatedAt: null
    };
  }

  onDragEnd = rawResult => {
    const result = this.mapRawDragResult(rawResult);
    if (!result) return;
    const {
      type,
      sourceIndex,
      sourceList,
      destinationIndex,
      destinationList
    } = result;
    if (sourceList === "current" && destinationList === "current")
      return this.move(sourceIndex, destinationIndex);
    if (sourceList === "available" && destinationList === "current")
      return this.insert(type, destinationIndex);
  };

  get currentBlocks() {
    return this.state.blocks;
  }

  get clonedCurrentBlocks() {
    return Array.from(this.currentBlocks);
  }

  get entityCallbacks() {
    return {
      showBlock: this.showBlock,
      hideBlock: this.hideBlock,
      deleteBlock: this.deleteBlock,
      saveBlockPosition: this.updateBlock,
      editBlock: this.editBlock
    };
  }

  move(from, to) {
    const adjustedTo = to < 0 ? 0 : to; // TODO: Why is to sometimes -1?
    const blocks = this.clonedCurrentBlocks;
    const [block] = blocks.splice(from, 1);
    const updatedBlock = this.updateBlockPosition(block, adjustedTo);
    blocks.splice(adjustedTo, 0, updatedBlock);
    this.setState({ blocks }, this.updateBlock(updatedBlock));
  }

  insert(type, position, id = "pending") {
    const block = { id, type, attributes: { position } };
    const blocks = this.clonedCurrentBlocks;
    blocks.splice(position, 0, block);
    this.setState({ blocks }, this.editBlock(block));
  }

  // TODO: Implement this
  editBlock = block => {
    console.log("Open a drawer and pass it this:");
    console.table(block);
    console.log(
      `This POC will error if you try to create two content blocks in a row because they will both have a "pending" ID. Once this is wired to the API, the new collection will come in with the updated ID, which should avoid this problem.`
    );
  };

  // TODO: Implement this
  updateBlock = updatedBlock => {
    console.log(
      `Flesh out this method to send an update request to the API for this block.`
    );
    console.table({
      "block ID": updatedBlock.id,
      "original index": this.blockPositionInProps(updatedBlock.id),
      "new index": updatedBlock.attributes.position
    });
    console.log(
      `This POC will only work the first time you move something. Since we're not yet updating props with an API call, subsequent moves won't report the original index correctly.`
    );
  };

  // TODO: Implement this
  deleteBlock = block => {
    console.log(`Delete this block.`);
    console.table(block);
  };

  // TODO: Implement this
  showBlock = block => {
    console.log(`Make this block visible.`);
    console.table(block);
  };

  // TODO: Implement this
  hideBlock = block => {
    console.log(`Hide this block.`);
    console.table(block);
  };

  mapRawDragResult(result) {
    if (!result.destination || !result.source) return;
    const {
      draggableId: type,
      source: { index: sourceIndex, droppableId: sourceList },
      destination: { index: destinationIndex, droppableId: destinationList }
    } = result;
    return { type, sourceIndex, sourceList, destinationIndex, destinationList };
  }

  updateBlockPosition(block, position) {
    const attributes = Object.assign({}, block.attributes, { position });
    return Object.assign({}, block, { attributes });
  }

  blockPositionInProps(id) {
    const block = this.props.project.relationships.contentBlocks.find(
      b => b.id === id
    );
    if (block) return block.attributes.position;
    return null;
  }

  render() {
    return (
      <section className="backend-project-content">
        <Developer.Debugger object={{ props: this.props, state: this.state }} />
        <DragDropContext onDragEnd={this.onDragEnd}>
          <AvailableSection currentBlocks={this.currentBlocks} />
          <CurrentSection
            entityCallbacks={this.entityCallbacks}
            currentBlocks={this.currentBlocks}
          />
        </DragDropContext>
      </section>
    );
  }
}
