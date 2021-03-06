import React from "react";
import renderer from "react-test-renderer";
import { ResourceCollectionResourcesContainer } from "../Resources";
import { wrapWithRouter } from "test/helpers/routing";
import { Provider } from "react-redux";
import build from "test/fixtures/build";

describe("Backend ResourceCollection Resources Container", () => {
  const store = build.store();
  const collection = build.entity.resourceCollection("1");
  const resources = [build.entity.resource("3"), build.entity.resource("4")];
  collection.relationships.resources = [resources[0]];
  collection.relationships.project = build.entity.project("5");

  const component = renderer.create(
    wrapWithRouter(
      <Provider store={store}>
        <ResourceCollectionResourcesContainer
          resourceCollection={collection}
          resources={resources}
          resourcesMeta={{
            pagination: build.pagination()
          }}
          dispatch={store.dispatch}
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
