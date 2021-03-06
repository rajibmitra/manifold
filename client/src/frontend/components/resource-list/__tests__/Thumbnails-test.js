import React from "react";
import renderer from "react-test-renderer";
import Thumbnails from "../Thumbnails";
import build from "test/fixtures/build";
import { wrapWithRouter, renderWithRouter } from "test/helpers/routing";

describe("Frontend.ResourceList.Thumbnails Component", () => {
  const project = build.entity.project("3");
  const resources = [build.entity.resource("1"), build.entity.resource("2")];

  it("renders correctly", () => {
    const component = renderer.create(
      wrapWithRouter(<Thumbnails resources={resources} project={project} />)
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
