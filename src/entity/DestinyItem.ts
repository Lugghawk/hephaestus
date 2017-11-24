import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";


@Entity()
export class DestinyItem {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    iconUrl: string;

    @Column()
    itemTypeAndDisplayName?: string;

    @Column()
    rarity?: string;

    public toString = () : string => {
        return `
        id: ${this.id}
        name: ${this.name}
        description: ${this.description}
        iconUrl: ${this.iconUrl}
        itemTypeAndDisplayName: ${this.itemTypeAndDisplayName},
        rarity: ${this.rarity}`
    }
}