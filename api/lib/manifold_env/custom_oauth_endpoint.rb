module ManifoldEnv
  class CustomOauthEndpoint
    def initialize(provider:, name:, uri:, method: :get, query: {})
      @provider = provider
      @name = name.to_sym
      @uri = uri
      @http_method = method.to_s.downcase.to_sym
      @query = query
    end

    attr_reader :http_method

    attr_reader :name

    attr_reader :provider

    delegate :build_url, to: :provider

    attr_reader :query

    attr_reader :uri

    def url
      @url ||= build_url path: uri
    end
  end
end
