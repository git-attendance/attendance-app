export class APIService {
	query: string;

	constructor() {
		this.query = "";
	}

	// Private method to append to query
	#appendToQuery(query: string) {
		if (this.query === "") {
			this.query = `?${query}`;
		} else {
			this.query += `&${query}`;
		}
	}

	buildSearchBody(
		queryKey?: any,
		populateArray?: string[],
		sort?: string,
		skip?: number,
		select?: string[],
		limit?: number,
		lean?: boolean,
	) {
		return {
			query: queryKey,
			populateArray: populateArray,
			sort: sort,
			skip: skip,
			select: select ? select.join(" ") : undefined,
			limit: limit,
			lean: lean,
		};
	}

	select(selectArray: string[]) {
		selectArray.forEach((select) => this.#appendToQuery(`select=${select}`));
		return this; // Return this for chaining
	}

	populate(
		populateArray: {
			path: string;
			select?: string;
			match?: Record<string, any>;
			options?: Record<string, any>;
			model?: string;
		}[],
	) {
		populateArray.forEach((populate) => {
			this.#appendToQuery(`populateArray[]=${encodeURIComponent(populate.path)}`);

			if (populate.select) {
				this.#appendToQuery(
					`populateSelect[${populate.path}]=${encodeURIComponent(populate.select)}`,
				);
			}

			if (populate.match) {
				this.#appendToQuery(
					`populateMatch[${populate.path}]=${encodeURIComponent(
						JSON.stringify(populate.match),
					)}`,
				);
			}

			if (populate.options) {
				this.#appendToQuery(
					`populateOptions[${populate.path}]=${encodeURIComponent(
						JSON.stringify(populate.options),
					)}`,
				);
			}

			if (populate.model) {
				this.#appendToQuery(
					`populateModel[${populate.path}]=${encodeURIComponent(populate.model)}`,
				);
			}
		});
		return this;
	}

	sort(sort: string) {
		this.#appendToQuery(`sort=${sort}`);
		return this; // Return this for chaining
	}

	limit(limit: number) {
		this.#appendToQuery(`limit=${limit}`);
		return this; // Return this for chaining
	}

	page(page: number) {
		this.#appendToQuery(`page=${page}`);
		return this; // Return this for chaining
	}

	skip(skip: number) {
		this.#appendToQuery(`skip=${skip}`);
		return this; // Return this for chaining
	}

	lean(lean: boolean = true) {
		this.#appendToQuery(`lean=${lean}`);
		return this; // Return this for chaining
	}

	resetQuery() {
		this.query = ""; // Resets the query for future use
	}
}
