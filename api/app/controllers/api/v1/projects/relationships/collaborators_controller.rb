module Api
  module V1
    module Projects
      module Relationships
        # Responds with collaborators in a project
        class CollaboratorsController < ApplicationController

          before_action :set_project

          resourceful! Collaborator, authorize_options: { except: [:index, :show] } do
            @project.collaborators
          end

          def index
            @collaborators = load_collaborators
            render_multiple_resources(
              @collaborators,
              include: %w(maker),
              each_serializer: CollaboratorSerializer,
              location: api_v1_project_relationships_collaborators_url(@project)
            )
          end

          def show
            @collaborator = load_collaborator
            render_single_resource(@collaborator)
          end

          private

          def load_collaborator
            @project.collaborators.find(params[:id])
          end

          def set_project
            @project = Project.friendly.find(params[:project_id])
          end

        end
      end
    end
  end
end
