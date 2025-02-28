import { Event } from "./Event";
import { ProjectCodeEvents } from "./ProjectCodeEvents";

interface EventsRegistry {
    [fieldName: string]: Event;
}

export const eventsRegistry: EventsRegistry = {
    project_code: new ProjectCodeEvents(),
};