import { category } from "../builder";

const projects = {
	/** CODE GENERATION GUARD */
	...(await import("./adultLanguageTeaching")).default,
	...(await import("./aiDataPrivacy")).default,
	...(await import("./aiEthicsInMiddleSchool")).default,
	...(await import("./aiStorybook")).default,
	...(await import("./arduinoMicrobitRobots")).default,
	...(await import("./autonomousAgents")).default,
	...(await import("./autonomousCar")).default,
	...(await import("./c2c")).default,
	...(await import("./computationalAction")).default,
	...(await import("./daily")).default,
	...(await import("./dancingWithAI")).default,
	...(await import("./dataActivism")).default,
	...(await import("./dayOfAI")).default,
	...(await import("./debatingAIWithYourChild")).default,
	...(await import("./deepFakes")).default,
	...(await import("./depressionSocialModeling")).default,
	...(await import("./designJustice")).default,
	...(await import("./doodleBot")).default,
	...(await import("./dynamicProceduralInteractions")).default,
	...(await import("./earlyLiteracy")).default,
	...(await import("./explorationLiteracy")).default,
	...(await import("./featurePerception")).default,
	...(await import("./ganPaint")).default,
	...(await import("./growthMindset")).default,
	...(await import("./howToTrainYourRobot")).default,
	...(await import("./humanAICollaboration")).default,
	...(await import("./jibo")).default,
	...(await import("./levelUp")).default,
	...(await import("./medicationsAdherence")).default,
	...(await import("./museumInteraction")).default,
	...(await import("./olderAdultCodesign")).default,
	...(await import("./personalStorytelling")).default,
	...(await import("./popBots")).default,
	...(await import("./primaryAI")).default,
	...(await import("./raica")).default,
	...(await import("./raisePlayground")).default,
	...(await import("./robotPolicyDesignToolkit")).default,
	...(await import("./robotsInTheHome")).default,
	...(await import("./socialEmotionalLearning")).default,
	...(await import("./soundOfAI")).default,
	...(await import("./speechBlocks")).default,
	...(await import("./wellness")).default,
	/** CODE GENERATION GUARD */
};

export default category("projects", projects);

export type ProjectName = keyof typeof projects;

