import React from "react";
import renderer from "react-test-renderer";
import { ProjectTextsContainer } from "../Texts";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend Project Texts Container", () => {
  const store = build.store();
  const project = build.entity.project("1");
  const category = build.entity.category("2");
  const textA = build.entity.text("3");
  const textB = build.entity.text("4");
  project.relationships.textCategories = [category];
  textB.relationships.category = textB;
  project.relationships.texts = [textA, textB];

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <ProjectTextsContainer
          project={project}
          route={{
            routes: []
          }}
        />
      </Provider>
    )
  );

  it("renders correctly", () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("doesn't render to null", () => {
    let tree = component.toJSON();
    expect(tree).not.toBe(null);
  });
});
