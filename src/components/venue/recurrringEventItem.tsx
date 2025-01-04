import {RecurringEvent} from "../../data/types.ts";
import {Card, Typography} from "antd";

const {Title, Text} = Typography;
export default function RecurringEventItem({event}: { event: RecurringEvent }) {

    return <Card>
        <div>
            <Title level={4}>Event Name</Title>
            <Text>{event.name}</Text>
        </div>
        <div>
            <Title level={4}>Tables</Title>
            <Text>{event.tables.reduce((sum, table) => sum + table.available, 0)}</Text>
        </div>
        <div>
            <Title level={4}>Day of Week</Title>
            <Text>{['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][event.dayOfWeek]}</Text>
        </div>
        <div>
            <Title level={4}>Start Time</Title>
            <Text>{event.startTime}</Text>
        </div>
        <div>
            <Title level={4}>End Time</Title>
            <Text>{event.endTime}</Text>
        </div>
    </Card>
}
