export interface IAxiosErrorData {
	length: number;
	name: string;
	severity: string;
	code: string;
	detail?: string;
	schema?: string;
	table?: string;
	constraint?: string;
	file?: string;
	line?: string;
	routine?: string;
}
