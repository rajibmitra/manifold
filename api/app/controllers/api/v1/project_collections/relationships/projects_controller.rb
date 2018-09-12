module Api
  module V1
    module ProjectCollections
      module Relationships
        class ProjectsController < ApplicationController

          before_action :set_project_collection, only: [:index]

          INCLUDES = %w(projects projects.creators projects.contributors).freeze

          resourceful! Project, authorize_options: { except: [:index, :show] } do
            ids = @project_collection.projects.select(:id)
            Project.filter(
              with_pagination!(project_filter_params),
              scope: Project.all.where(id: ids)
            )
          end

          # GET /resources
          def index
            @projects = load_projects
            render_multiple_resources(
              @projects,
              include: INCLUDES,
              each_serializer: ProjectSerializer,
              meta: { pagination: pagination_dict(@projects) },
              location: location
            )
          end

          private

          def set_project_collection
            @project_collection = ProjectCollection.friendly
                                                   .find(params[:project_collection_id])
          end

          def location
            api_v1_project_collection_relationships_projects_url(@project_collection)
          end

        end
      end
    end
  end
end
