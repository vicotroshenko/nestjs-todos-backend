export type CustomReqQuery =
	| { status?: string; search?: string; skip?: string; take?: string }
	| undefined;

export type StatisticType = {
	_count: { id: number };
};