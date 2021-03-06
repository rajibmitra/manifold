module Ingestions
  module Compilers
    class Maker < AbstractInteraction
      object :text
      hash :manifest, strip: false
      hash :attributes do
        string :name
      end

      def execute
        update_or_create
        report
      end

      private

      def maker
        @maker ||= initialize_maker
      end

      def collaborator
        @collaborator ||= initialize_collaborator
      end

      def initialize_maker
        ::Maker.find_or_create_by ::Maker.parse_name(attributes[:name])
      end

      def initialize_collaborator
        ::Collaborator.find_or_initialize_by maker: maker, collaboratable: text
      end

      def update_or_create
        collaborator.update collaborator_attributes
      end

      def collaborator_attributes
        {
          role: Collaborator::ROLE_CREATOR
        }
      end

      def report
        key = if collaborator.id_previously_changed?
                "services.ingestions.compiler.maker.log.new"
              else
                "services.ingestions.compiler.maker.log.updated"
              end

        info key, role: collaborator.role, name: maker.full_name
      end
    end
  end
end
