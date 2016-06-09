import React from 'react';
import { Route, IndexRedirect, IndexRoute } from 'react-router';
import { Frontend, Home, Login, Following, ProjectDetail } from 'containers/frontend';
import { Developer } from 'containers/developer';
import { Reader } from 'containers/reader';
import { NotFound } from './containers/global';
import { Section, AnnotationTools } from 'components/reader';
import { FormsStatic } from './components/frontend';

export default () => {
  return (
      <Route path="/" >
        <IndexRedirect to="browse" />
        <Route component={Developer} path="dev" />

        <Route component={Reader} path="read/:textId">
          <Route component={Section} path="section/:sectionId" />
          <Route component={AnnotationTools} path="annotation-tools" />
        </Route>

        <Route component={Frontend} path="/browse" >
          <IndexRoute component={Home} />
          <Route component={Login} path="login" />
          <Route component={Following} path="following" />
          <Route component={ProjectDetail} path="project/:id" />
        </Route>

        <Route component={Frontend} path="/static" >
          <Route component={FormsStatic} path="forms" />
        </Route>

        <Route component={Frontend} path="*">
          <IndexRoute component={NotFound} />
        </Route>
      </Route>
  );
};
