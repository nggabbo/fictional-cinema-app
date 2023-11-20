import { PhotoInfo } from "@shared/models";

export interface Movie{
    uuid: string;
    image: PhotoInfo;
    title: string;
    description: string;
    shortDescription: string;
    releaseDate: string;
    genre: string;
    rate: number;
}