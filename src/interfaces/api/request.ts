export interface IDaoProject {
  id: string;
  uuid: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  name: string;
  thumbnail: string;
  token_id: string;
  max_supply: number;
}

export interface IGetDaoArtist {
  id: string;
  uuid: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface IGetDaoProjectsPayload {
  keyword?: string | string[];
  status?: string | string[];
  limit: number;
  cursor?: string;
  sort?: string | string[];
  seq_id?: string | string[];
}

export interface IGetDaoProjectsResponse {
  result: IDaoProject[];
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  cursor: string;
  sort: number;
}

export interface IGetDaoArtistsPayload {
  keyword?: string | string[];
  status?: string | string[];
  limit: number;
  cursor?: string;
  sort?: string | string[];
  seq_id?: string | string[];
}

export interface IGetDaoArtistsResponse {
  result: IGetDaoArtist[];
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  cursor: string;
  sort: number;
}

export interface IPutDaoProjectResponse {
  error: {
    message: string;
    code: number;
  };
  status: boolean;
  data: Record<string, string>;
}

export interface IPutDaoArtistResponse {
  error: {
    message: string;
    code: number;
  };
  status: boolean;
  data: Record<string, string>;
}

export type IPostDaoArtistResponse = IPutDaoArtistResponse;

export interface IGetDaoProjectsIsHiddenPayload {
  keyword?: string | string[];
  limit: number;
  cursor?: string;
}

export type IGetDaoProjectsIsHiddenResponse = IGetDaoProjectsResponse;

export interface ICreateDaoProjectsPayload {
  project_ids: Array<string>;
}

export interface ICreateDaoProjectsResponse {
  error: {
    message: string;
    code: number;
  };
  status: boolean;
  data: Record<string, string>;
}
