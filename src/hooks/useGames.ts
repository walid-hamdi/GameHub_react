import { useInfiniteQuery } from "react-query";
import { FetchResponse } from "../services/api-client";
import { Platform } from "./usePlatforms";
import { Genre } from "./useGenres";
import gameService from "../services/gameService";
import ms from "ms";
import useGameQueryStore from "../store";

export interface Game {
  id: number;
  name: string;
  background_image: string;
  platforms: { platform: Platform }[];
  metacritic: number;
  genres: Genre[];
  rating_top: number;
}

const useGames = () => {
  const gameQuery = useGameQueryStore((s) => s.gameQuery);

  return useInfiniteQuery<FetchResponse<Game>, Error>({
    staleTime: ms("24h"),
    getNextPageParam: (lastPage, allPage) => {
      return lastPage.next ? allPage.length + 1 : undefined;
    },
    queryKey: ["games", gameQuery],
    queryFn: ({ pageParam = 1 }) =>
      gameService.getAll(gameQuery, pageParam).request.then((res) => res.data),
  });
};

export default useGames;
