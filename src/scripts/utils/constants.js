let i = 0;

const EVENTS = {
	LOADER_PROGRESS: i++,

	ATTACH: i++,
	RESIZE: i++,

	TICK: i++,
	RENDER: i++,
	AUTO_RANDOM: i++,

	POINTER_DOWN: i++,
	KEY_DOWN: i++,
	FIRST_CLICK: i++,

	PLAYER_ENTERED: i++,
	PLAYER_LEFT: i++,
	PLAYER_MOVED: i++,
};

const EVENTS_MAP = Object.fromEntries(
	Object.entries(EVENTS).map(([key, value]) => [
		value,
		`on${key
			.toLowerCase()
			.split('_')
			.map((str) => str.charAt(0).toUpperCase() + str.slice(1))
			.join('')}`,
	]),
);

const POSE = {
	NOSE: 0,
	LEFT_EYE_INNER: 1,
	LEFT_EYE: 2,
	LEFT_EYE_OUTER: 3,
	RIGHT_EYE_INNER: 4,
	RIGHT_EYE: 5,
	RIGHT_EYE_OUTER: 6,
	LEFT_EAR: 7,
	RIGHT_EAR: 8,
	MOUTH_LEFT: 9,
	MOUTH_RIGHT: 10,
	LEFT_SHOULDER: 11,
	RIGHT_SHOULDER: 12,
	LEFT_ELBOW: 13,
	RIGHT_ELBOW: 14,
	LEFT_WRIST: 15,
	RIGHT_WRIST: 16,
	LEFT_PINKY: 17,
	RIGHT_PINKY: 18,
	LEFT_INDEX: 19,
	RIGHT_INDEX: 20,
	LEFT_THUMB: 21,
	RIGHT_THUMB: 22,
	LEFT_HIP: 23,
	RIGHT_HIP: 24,
	LEFT_KNEE: 25,
	RIGHT_KNEE: 26,
	LEFT_ANKLE: 27,
	RIGHT_ANKLE: 28,
	LEFT_HEEL: 29,
	RIGHT_HEEL: 30,
	LEFT_FOOT_INDEX: 31,
	RIGHT_FOOT_INDEX: 32,
};

const POSE_CONNECTIONS = [
	// Chest
	[POSE.LEFT_SHOULDER, POSE.RIGHT_SHOULDER],
	[POSE.RIGHT_SHOULDER, POSE.RIGHT_HIP],
	[POSE.RIGHT_HIP, POSE.LEFT_HIP],
	[POSE.LEFT_HIP, POSE.LEFT_SHOULDER],

	// Right arm
	[POSE.RIGHT_SHOULDER, POSE.RIGHT_ELBOW],
	[POSE.RIGHT_ELBOW, POSE.RIGHT_WRIST],
	[POSE.RIGHT_WRIST, POSE.RIGHT_INDEX],

	// Left arm
	[POSE.LEFT_SHOULDER, POSE.LEFT_ELBOW],
	[POSE.LEFT_ELBOW, POSE.LEFT_WRIST],
	[POSE.LEFT_WRIST, POSE.LEFT_INDEX],

	// Right leg
	[POSE.RIGHT_HIP, POSE.RIGHT_KNEE],
	[POSE.RIGHT_KNEE, POSE.RIGHT_ANKLE],
	[POSE.RIGHT_ANKLE, POSE.RIGHT_FOOT_INDEX],

	// Left leg
	[POSE.LEFT_HIP, POSE.LEFT_KNEE],
	[POSE.LEFT_KNEE, POSE.LEFT_ANKLE],
	[POSE.LEFT_ANKLE, POSE.LEFT_FOOT_INDEX],
];

export { EVENTS, EVENTS_MAP, POSE, POSE_CONNECTIONS };
