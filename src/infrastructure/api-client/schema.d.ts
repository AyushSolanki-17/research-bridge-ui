export interface paths {
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Health
         * @description Report process availability without checking databases or external providers.
         */
        get: operations["get_health"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/graphs/explore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Explore Citations
         * @description Return a bounded neighborhood in the requested citation directions.
         */
        post: operations["explore_citations"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/graphs/outgoing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Explore Outgoing
         * @description Return an outgoing neighborhood with explicit scope and completion status.
         */
        post: operations["explore_outgoing"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/papers/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Resolve Paper
         * @description Resolve a DOI or work identifier to canonical metadata and evidence.
         */
        post: operations["resolve_paper"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/papers/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Search Papers
         * @description Review an attributed candidate page; select an identifier to resolve or explore.
         */
        post: operations["search_papers"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /**
         * Author
         * @description Paper author.
         *
         *     Attributes:
         *         display_name: Author name as reported by the provider.
         *         orcid: ORCID identifier if available.
         *         position: Authorship position (e.g., ``first``, ``middle``, ``last``).
         */
        Author: {
            /** Display Name */
            display_name: string;
            /** Orcid */
            orcid?: string | null;
            /** Position */
            position?: string | null;
        };
        /**
         * CitationEdge
         * @description Reported citation from source to target, with its original reference identity.
         *
         *     Attributes:
         *         source: Canonical citing work.
         *         target: Canonical referenced work if resolved; otherwise original identifier.
         *         referenced_id: Identifier asserted by the source before merge resolution.
         *         evidence: Source record and observation supporting this reference assertion.
         */
        CitationEdge: {
            evidence: components["schemas"]["Evidence"];
            referenced_id: components["schemas"]["OpenAlexWorkId"];
            source: components["schemas"]["OpenAlexWorkId"];
            target: components["schemas"]["OpenAlexWorkId"];
        };
        /**
         * CitationExploreRequest
         * @description Citation exploration direction with the same shared operation bounds.
         */
        CitationExploreRequest: {
            /** @description Filter returned papers after bounded traversal; always retain the seed. */
            filters?: components["schemas"]["FiltersRequest"] | null;
            /** Identifier */
            identifier: string;
            limits?: components["schemas"]["LimitsRequest"];
            /**
             * Mode
             * @default outgoing
             * @enum {string}
             */
            mode?: "outgoing" | "incoming" | "both";
        };
        /**
         * Doi
         * @description Validated DOI value object.
         *
         *     Attributes:
         *         value: Normalized DOI (lowercased, without prefix or URL).
         */
        Doi: {
            /** Value */
            value: string;
        };
        /**
         * ErrorDetail
         * @description Stable error code and safe message, without internal exception details.
         */
        ErrorDetail: {
            /** Code */
            code: string;
            /** Message */
            message: string;
        };
        /**
         * ErrorResponse
         * @description Expected research HTTP failure envelope.
         */
        ErrorResponse: {
            error: components["schemas"]["ErrorDetail"];
        };
        /**
         * Evidence
         * @description Stable, source-attributed evidence record.
         *
         *     Attributes:
         *         id: Stable identifier, e.g., ``openalex:work:W2741809807``.
         *         provider: Provider name, e.g., ``openalex``.
         *         provider_record_id: Provider's record identifier, e.g., ``W2741809807``.
         *         source_url: Inspectable source reference URL.
         *         observed_at: Time the record was observed. Does not affect identity.
         *         inference_status: How the associated fact should be interpreted.
         */
        Evidence: {
            /** Id */
            id: string;
            /** @default reported */
            inference_status?: components["schemas"]["InferenceStatus"];
            /**
             * Observed At
             * Format: date-time
             */
            observed_at: string;
            /** Provider */
            provider: string;
            /** Provider Record Id */
            provider_record_id: string;
            /** Source Url */
            source_url: string;
        };
        /**
         * ExplorationFilters
         * @description Conjunctive predicates on available paper metadata, applied after traversal.
         *
         *     Attributes:
         *         year_from: Inclusive publication year lower bound, from 1 through 9999.
         *         year_to: Inclusive publication year upper bound, from 1 through 9999.
         *         min_citations: Inclusive nonnegative reported citation-count lower bound.
         *         max_citations: Inclusive nonnegative reported citation-count upper bound.
         *         author: Exact normalized display name of any author, at most 300 characters.
         *         venue: Exact normalized venue display name, at most 300 characters.
         *         topic: Exact normalized display name of any topic, at most 300 characters.
         *
         *     None disables a predicate. Missing metadata fails an enabled predicate.
         *     Names collapse whitespace and ignore case; they do not resolve identities.
         *     Invalid bounds, reversed ranges or blank names raise InvalidFilterError.
         */
        ExplorationFilters: {
            /** Author */
            author?: string | null;
            /** Max Citations */
            max_citations?: number | null;
            /** Min Citations */
            min_citations?: number | null;
            /** Topic */
            topic?: string | null;
            /** Venue */
            venue?: string | null;
            /** Year From */
            year_from?: number | null;
            /** Year To */
            year_to?: number | null;
        };
        /**
         * ExplorationLimits
         * @description Validated bounds shared by all directions in one neighborhood.
         *
         *     Attributes:
         *         depth: Citation hops, from 1 through 3; seed is at depth zero.
         *         max_nodes: Paper limit including the seed, from 1 through 500.
         *         max_edges: Unique directed edge limit, from 1 through 2000.
         *         max_requests: Physical request limit including retries, from 1 through 1000.
         *         max_seconds: Positive finite elapsed limit, at most 120 seconds.
         */
        ExplorationLimits: {
            /**
             * Depth
             * @default 1
             */
            depth?: number;
            /**
             * Max Edges
             * @default 200
             */
            max_edges?: number;
            /**
             * Max Nodes
             * @default 50
             */
            max_nodes?: number;
            /**
             * Max Requests
             * @default 100
             */
            max_requests?: number;
            /**
             * Max Seconds
             * @default 30
             */
            max_seconds?: number;
        };
        /**
         * ExplorationResult
         * @description Immutable acquired neighborhood and explicit completion evidence.
         *
         *     Attributes:
         *         seed: Resolved seed identity, or None if acquisition failed.
         *         nodes: Retained papers in breadth-first discovery order; seed is always retained.
         *         edges: Unique directed citations in stable traversal order.
         *         unresolved: References that could not be acquired.
         *         incomplete_metadata: Missing fields on retained records.
         *         status: Complete within scope, truncated, or failed acquisition.
         *         stop_reasons: Machine-readable explanations, empty for complete results.
         *         limits: Applied validated bounds.
         *         requests: Physical provider requests consumed, including seed and retries.
         *         elapsed_seconds: Monotonic operation duration.
         *         mode: Direction followed during discovery; edges always mean citing to cited.
         *         unread_incoming_pages: Incoming pages interrupted during acquisition or processing.
         *         filters: Normalized predicates, or None for the original unfiltered result.
         *         filter_scope: Filters affect returned results within the bounded neighborhood.
         *         acquired_nodes: Paper count before filtering, including the seed.
         *         acquired_edges: Citation count before filtering, including unresolved endpoints.
         */
        ExplorationResult: {
            /**
             * Acquired Edges
             * @default 0
             */
            acquired_edges?: number;
            /**
             * Acquired Nodes
             * @default 0
             */
            acquired_nodes?: number;
            /** Edges */
            edges: components["schemas"]["CitationEdge"][];
            /** Elapsed Seconds */
            elapsed_seconds: number;
            /**
             * Filter Scope
             * @default returned_results
             * @constant
             */
            filter_scope?: "returned_results";
            filters?: components["schemas"]["ExplorationFilters"] | null;
            /** Incomplete Metadata */
            incomplete_metadata: components["schemas"]["MetadataGap"][];
            limits: components["schemas"]["ExplorationLimits"];
            /**
             * Mode
             * @default outgoing
             * @enum {string}
             */
            mode?: "outgoing" | "incoming" | "both";
            /** Nodes */
            nodes: components["schemas"]["ResolvedPaper"][];
            /** Requests */
            requests: number;
            seed: components["schemas"]["OpenAlexWorkId"] | null;
            /**
             * Status
             * @enum {string}
             */
            status: "complete" | "truncated" | "failed";
            /** Stop Reasons */
            stop_reasons: string[];
            /**
             * Unread Incoming Pages
             * @default []
             */
            unread_incoming_pages?: components["schemas"]["IncomingPageGap"][];
            /** Unresolved */
            unresolved: components["schemas"]["UnresolvedReference"][];
        };
        /**
         * ExploreRequest
         * @description Outgoing exploration input with optional bounded overrides.
         */
        ExploreRequest: {
            /** @description Filter returned papers after bounded traversal; always retain the seed. */
            filters?: components["schemas"]["FiltersRequest"] | null;
            /** Identifier */
            identifier: string;
            limits?: components["schemas"]["LimitsRequest"];
        };
        /**
         * FiltersRequest
         * @description Metadata predicates; application contracts own matching and range validation.
         */
        FiltersRequest: {
            /**
             * Author
             * @description Exact author display name.
             */
            author?: string | null;
            /**
             * Max Citations
             * @description Inclusive count, at least 0.
             */
            max_citations?: number | null;
            /**
             * Min Citations
             * @description Inclusive count, at least 0.
             */
            min_citations?: number | null;
            /**
             * Topic
             * @description Exact topic display name.
             */
            topic?: string | null;
            /**
             * Venue
             * @description Exact venue display name.
             */
            venue?: string | null;
            /**
             * Year From
             * @description Inclusive year: 1–9999.
             */
            year_from?: number | null;
            /**
             * Year To
             * @description Inclusive year: 1–9999.
             */
            year_to?: number | null;
        };
        /**
         * HealthResponse
         * @description Immutable HTTP contract for process liveness.
         */
        HealthResponse: {
            /**
             * Status
             * @default ok
             * @constant
             */
            status?: "ok";
        };
        /**
         * IncomingPageGap
         * @description An incoming page that was not fully processed.
         *
         *     Attributes:
         *         target: Referenced work whose citing neighborhood remains incomplete.
         *         cursor: Provider page that failed or was only partially processed.
         *         reason: Budget limit, repeated cursor, provider failure or cancellation.
         */
        IncomingPageGap: {
            /** Cursor */
            cursor: string;
            /** Reason */
            reason: string;
            target: components["schemas"]["OpenAlexWorkId"];
        };
        /**
         * InferenceStatus
         * @description Whether a value was reported or inferred.
         *
         *     Attributes:
         *         REPORTED: Directly reported fact (e.g., title, citation count).
         *         INFERRED_PROVIDER: Value inferred or classified by the provider
         *             (e.g., OpenAlex topics with a supplied score).
         * @enum {string}
         */
        InferenceStatus: "reported" | "inferred_provider";
        /**
         * LimitsRequest
         * @description HTTP budget types; the application owns numeric bounds and validation.
         */
        LimitsRequest: {
            /**
             * Depth
             * @description Citation hops: 1 through 3.
             * @default 1
             */
            depth?: number;
            /**
             * Max Edges
             * @description Edges: 1 through 2000.
             * @default 200
             */
            max_edges?: number;
            /**
             * Max Nodes
             * @description Papers: 1 through 500.
             * @default 50
             */
            max_nodes?: number;
            /**
             * Max Requests
             * @description Physical requests: 1 through 1000.
             * @default 100
             */
            max_requests?: number;
            /**
             * Max Seconds
             * @description Finite elapsed seconds: greater than 0, at most 120.
             * @default 30
             */
            max_seconds?: number;
        };
        /**
         * MetadataGap
         * @description Unavailable metadata fields for an acquired work.
         *
         *     Attributes:
         *         work_id: Canonical work identity.
         *         fields: Field names with unavailable values; no facts are inferred.
         */
        MetadataGap: {
            /** Fields */
            fields: string[];
            work_id: components["schemas"]["OpenAlexWorkId"];
        };
        /**
         * OpenAlexWorkId
         * @description Validated OpenAlex work identifier.
         *
         *     Attributes:
         *         value: Normalized identifier (uppercase ``W`` + digits).
         */
        OpenAlexWorkId: {
            /** Value */
            value: string;
        };
        /**
         * Paper
         * @description Canonical paper record.
         *
         *     Attributes:
         *         identifiers: Stable work identifiers.
         *         title: Paper title, or ``None`` if not reported.
         *         publication_date: Publication date, or ``None`` if unknown.
         *         venue: Publication venue, or ``None`` if unknown.
         *         authors: Ordered authors as reported.
         *         abstract: Reconstructed abstract text, or ``None`` if unavailable.
         *         cited_by_count: Provider-reported citation count, or ``None`` if missing.
         *             A reported ``0`` is preserved as ``0``.
         *         topics: Provider-reported topics with explicit inference status.
         *         referenced_works: Normalized OpenAlex IDs of referenced works.
         *         references_complete: Whether the provider supplied a valid reference list.
         *             False distinguishes missing or malformed lists from known empty lists.
         */
        Paper: {
            /** Abstract */
            abstract?: string | null;
            /**
             * Authors
             * @default []
             */
            authors?: components["schemas"]["Author"][];
            /** Cited By Count */
            cited_by_count?: number | null;
            identifiers: components["schemas"]["PaperIdentifiers"];
            /** Publication Date */
            publication_date?: string | null;
            /**
             * Referenced Works
             * @default []
             */
            referenced_works?: components["schemas"]["OpenAlexWorkId"][];
            /**
             * References Complete
             * @default false
             */
            references_complete?: boolean;
            /** Title */
            title?: string | null;
            /**
             * Topics
             * @default []
             */
            topics?: components["schemas"]["Topic"][];
            venue?: components["schemas"]["Venue"] | null;
        };
        /**
         * PaperIdentifiers
         * @description Stable identifiers for a paper.
         *
         *     Attributes:
         *         openalex_id: Normalized OpenAlex work ID.
         *         doi: Normalized DOI if available.
         */
        PaperIdentifiers: {
            doi?: components["schemas"]["Doi"] | null;
            openalex_id: components["schemas"]["OpenAlexWorkId"];
        };
        /**
         * ResolveRequest
         * @description Identifier lookup input; unknown fields are rejected.
         */
        ResolveRequest: {
            /** Identifier */
            identifier: string;
        };
        /**
         * ResolvedPaper
         * @description Framework-independent result for a resolved paper.
         *
         *     Attributes:
         *         paper: Canonical paper record.
         *         evidence: Stable attribution for the record.
         */
        ResolvedPaper: {
            evidence: components["schemas"]["Evidence"];
            paper: components["schemas"]["Paper"];
        };
        /**
         * SearchLimits
         * @description Validated search bounds, including replay of earlier candidate pages.
         *
         *     Attributes:
         *         page_size: Candidates per public page, from 1 to 100.
         *         max_results: Unique candidates considered per search, from 1 to 500.
         *         max_requests: Physical requests per call, from 1 to 100.
         *         max_seconds: Finite elapsed allowance per call, greater than 0 up to 120.
         */
        SearchLimits: {
            /**
             * Max Requests
             * @default 20
             */
            max_requests?: number;
            /**
             * Max Results
             * @default 100
             */
            max_results?: number;
            /**
             * Max Seconds
             * @default 30
             */
            max_seconds?: number;
            /**
             * Page Size
             * @default 10
             */
            page_size?: number;
        };
        /**
         * SearchLimitsRequest
         * @description Search budget types; application contracts validate numeric bounds.
         */
        SearchLimitsRequest: {
            /**
             * Max Requests
             * @default 20
             */
            max_requests?: number;
            /**
             * Max Results
             * @default 100
             */
            max_results?: number;
            /**
             * Max Seconds
             * @default 30
             */
            max_seconds?: number;
            /**
             * Page Size
             * @default 10
             */
            page_size?: number;
        };
        /**
         * SearchRequest
         * @description Title text and one-based candidate page, without automatic seed selection.
         */
        SearchRequest: {
            limits?: components["schemas"]["SearchLimitsRequest"];
            /**
             * Page
             * @default 1
             */
            page?: number;
            /** Query */
            query: string;
        };
        /**
         * SearchResult
         * @description One deduplicated candidate page and truthful acquisition status.
         *
         *     Attributes:
         *         query: Normalized title query; no candidate is implicitly selected.
         *         page: One-based requested page.
         *         candidates: Available candidates on this page, each with evidence.
         *         next_page: Next page only when more provider results can be reviewed.
         *         status: Complete at provider end, more for pagination, truncated at a
         *             limit or repeated cursor, or failed on an upstream error.
         *         stop_reasons: Machine-readable reasons for incomplete acquisition.
         *         limits: Applied bounds, including replay of prior pages.
         *         requests: Physical requests consumed by this call.
         */
        SearchResult: {
            /** Candidates */
            candidates: components["schemas"]["ResolvedPaper"][];
            limits: components["schemas"]["SearchLimits"];
            /** Next Page */
            next_page: number | null;
            /** Page */
            page: number;
            /** Query */
            query: string;
            /** Requests */
            requests: number;
            /**
             * Status
             * @enum {string}
             */
            status: "complete" | "more" | "truncated" | "failed";
            /** Stop Reasons */
            stop_reasons: string[];
        };
        /**
         * Topic
         * @description Provider-classified topic.
         *
         *     Attributes:
         *         id: Topic identifier (e.g., OpenAlex topic URL or ID).
         *         display_name: Human readable topic name.
         *         score: Provider-supplied relevance score, or ``None`` if not reported.
         *         inference_status: Always ``INFERRED_PROVIDER`` for OpenAlex topics.
         *         subfield: Optional subfield name if provider supplies it.
         *         field: Optional field name if provider supplies it.
         *         domain: Optional domain name if provider supplies it.
         */
        Topic: {
            /** Display Name */
            display_name: string | null;
            /** Domain */
            domain?: string | null;
            /** Field */
            field?: string | null;
            /** Id */
            id: string | null;
            /** @default inferred_provider */
            inference_status?: components["schemas"]["InferenceStatus"];
            /** Score */
            score: number | null;
            /** Subfield */
            subfield?: string | null;
        };
        /**
         * UnresolvedReference
         * @description An acquired reference whose target could not be resolved.
         *
         *     Attributes:
         *         source: Citing work, absent only for seed acquisition failure.
         *         target: Requested target identifier.
         *         reason: Missing work, provider failure, cancellation or budget limit.
         */
        UnresolvedReference: {
            /** Reason */
            reason: string;
            source: components["schemas"]["OpenAlexWorkId"] | null;
            /** Target */
            target: string;
        };
        /**
         * Venue
         * @description Publication venue.
         *
         *     Attributes:
         *         display_name: Venue name as reported.
         *         id: OpenAlex source ID if available (e.g., ``S123`` or URL).
         */
        Venue: {
            /** Display Name */
            display_name?: string | null;
            /** Id */
            id?: string | null;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    get_health: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthResponse"];
                };
            };
        };
    };
    explore_citations: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CitationExploreRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExplorationResult"];
                };
            };
            /** @description Seed not found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExplorationResult"];
                };
            };
            /** @description Unprocessable Content */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Too Many Requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Provider failure with partial data. */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExplorationResult"];
                };
            };
            /** @description Gateway Timeout */
            504: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    explore_outgoing: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ExploreRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExplorationResult"];
                };
            };
            /** @description Seed not found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExplorationResult"];
                };
            };
            /** @description Unprocessable Content */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Too Many Requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Provider failure with partial data. */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ExplorationResult"];
                };
            };
            /** @description Gateway Timeout */
            504: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    resolve_paper: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResolveRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResolvedPaper"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Unprocessable Content */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Too Many Requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Gateway Timeout */
            504: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    search_papers: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SearchRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SearchResult"];
                };
            };
            /** @description Not Found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Unprocessable Content */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Too Many Requests */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Provider failure with partial candidates. */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SearchResult"];
                };
            };
            /** @description Gateway Timeout */
            504: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
}
