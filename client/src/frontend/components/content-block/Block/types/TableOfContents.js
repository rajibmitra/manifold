import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Wrapper from "../parts/Wrapper";
import Heading from "../parts/Heading";
import Contents from "./TOCBlock/Contents";

export default class ProjectContentBlockTableOfContentsBlock extends PureComponent {
  static displayName = "Project.Content.Block.TableOfContents";

  static propTypes = {
    block: PropTypes.object.isRequired
  };

  get title() {
    return this.blockAttributes.title || "Table of Contents";
  }

  get icon() {
    return "bulletList";
  }

  get blockAttributes() {
    return this.props.block.attributes;
  }

  get text() {
    return this.props.block.relationships.text;
  }

  get depth() {
    return this.blockAttributes.depth;
  }

  get showAuthors() {
    return this.blockAttributes.showAuthors;
  }

  get showTextTitle() {
    return this.blockAttributes.showTextTitle;
  }

  render() {
    const blockClass = "entity-section-wrapper";

    return (
      <Wrapper>
        <Heading title={this.title} icon={this.icon} />
        <div className={`${blockClass}__body`}>
          <Contents
            showTextTitle={this.showTextTitle}
            showAuthors={this.showAuthors}
            text={this.text}
            depth={this.depth}
          />
        </div>
      </Wrapper>
    );
  }
}
