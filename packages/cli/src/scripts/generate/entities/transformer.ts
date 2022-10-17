export const timestamptz = {
	to: (value: string | string[]) => {
		if (Array.isArray(value)) {
			return value.map(val => timestamptz.to(val));
		} else {
			let date = new Date();
			if (value) {
				date = new Date(value);
			}
			return date;
		}
	},
	from: (value: Date | Date[]) => {
		if (Array.isArray(value)) {
			return value.map(val => timestamptz.from(val));
		}
		return value.getTime();
	}
};

export const json = {
	to: (value: any) => {
		return JSON.stringify(value);
	},
	from: (value: string) => {
		return JSON.parse(value);
	}
};

export const string = {
	to: (value: string[]) => {
		if (Array.isArray(value)) {
			return value.join('___');
		}
		return ``;
	},
	from: (value: string) => {
		if (value) return value.split('___');
		return [];
	}
};
