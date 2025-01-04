import {Card, Typography} from "antd";

import {VenueTable} from "../../data/types.ts";

const {Title, Text} = Typography;
export function VenueTableListingItem({table}: { table: VenueTable }) {
    return <Card>
        <div>
            <Title level={4}>Table Name</Title>
            <Text>{table.name}</Text>
        </div>
        <div>
            <Title level={4}>Description</Title>
            <Text>{table.description}</Text>
        </div>
        <div>
            <Title level={4}>Minimum Spend</Title>
            <Text>{table.minimumSpend}</Text>
        </div>
        <div>
            <Title level={4}>Available</Title>
            <Text>{table.available}</Text>
        </div>
    </Card>
}

