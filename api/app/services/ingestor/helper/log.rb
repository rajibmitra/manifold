require "naught"

module Ingestor
  module Helper
    # Logging helpers for EPUB ingestion strategy
    class Log
      def self.log_structure(structure, preface, logger)
        log_structure_recursive(structure, preface, logger)
      end

      def self.log_text_errors(text, logger)
        log_model_errors(text, logger)
        log_collection_errors(text.text_sections, logger)
        log_collection_errors(text.titles, logger)
        log_collection_errors(text.ingestion_sources, logger)
      end

      def self.log_collection_errors(collection, logger)
        collection.each do |model|
          log_model_errors(model, logger)
        end
      end

      def self.log_model_errors(model, logger)
        return if model.valid?
        model.errors.full_messages.each do |message|
          msg = "#{model.class.name} #{model.try(:source_identifier)}: #{message}"
          logger.error(msg.red)
        end
      end

      def self.log_structure_recursive(branch, preface, logger, indent = 0)
        branch.each do |leaf|
          # rubocop:disable Metrics/LineLength
          logger.debug "#{preface} #{' ' * indent}#{leaf[:label] || 'NULL'} #{"[#{leaf[:source_identifier]}]".light_cyan if leaf[:source_identifier]}"
          # rubocop:enable Metrics/LineLength
          if leaf[:children]
            log_structure_recursive(leaf[:children], preface, logger, indent + 2)
          end
        end
      end
    end
  end
end
