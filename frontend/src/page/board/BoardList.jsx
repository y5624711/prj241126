import {
  Alert,
  Box,
  Button,
  Card,
  Center,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  Spinner,
  Table,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LuSearch, LuTerminal } from "react-icons/lu";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "../../components/ui/native-select.jsx";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";
import Slider from "react-slick";

export function BoardList() {
  // 게시판 데이터 상태
  const [boardList, setBoardList] = useState([]);
  // 검색 키워드
  const [keyword, setKeyword] = useState("");
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  // 에러 메시지 상태
  const [errorMessage, setErrorMessage] = useState("");
  // 검색 데이터
  const [searchParams, setSearchParams] = useSearchParams("");
  // 검색 타입(제목...)
  const [type, setType] = useState("all"); // 검색 타입 (전체, 제목, 본문 중 선택)
  // 검색 타입(장소)
  const [site, setSite] = useState("allSite");
  // 조회수 탑 5개 받기
  const [topBoards, setTopBoards] = useState([]);

  const [searchPage, setSearchPage] = useSearchParams();
  const [count, setCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBoardList();
    fetchTopBoards();
  }, [searchParams, type, site, searchPage]);

  const fetchTopBoards = async () => {
    try {
      const response = await axios.get("/api/board/top-views"); // 상위 10개 조회수 API 호출
      setTopBoards(response.data); // 데이터 저장
    } catch (error) {
      console.error("인기 게시글 데이터를 가져오는 데 실패했습니다.");
    }
  };

  console.log(searchPage.toString());

  // page 번호
  const pageParam = searchPage.get("page") ? searchPage.get("page") : "1";
  const page = Number(pageParam);

  function handlePageChange(e) {
    console.log(e.page);
    const nextSearchParams = new URLSearchParams(searchPage);
    nextSearchParams.set("page", e.page);
    setSearchPage(nextSearchParams);
  }

  const fetchBoardList = async () => {
    try {
      const response = await axios.get("/api/board/list", {
        params: Object.fromEntries(searchPage.entries()), //**URL의 쿼리스트링을 서버로 전달
        //entries() : 키-값 쌍의 반복 가능한 이터레이터
      });

      console.log(response);
      setBoardList(response.data.list);
      setCount(response.data.count);
    } catch (error) {
      console.error("데이터를 불러오는데 실패했습니다.");
      setErrorMessage("데이터를 불러오는 데 실패하였습니다."); // ** 에러 메시지 추가
    } finally {
      setIsLoading(false);
    }
  };

  console.log(searchParams.get("keyword"));

  /*클릭 시 조회수 증가 처리 추가*/
  const handleRowClick = async (number) => {
    console.log(`${number}번 게시물 이동`);

    try {
      navigate(`/board/view/${number}`);
      await axios.post(`/api/board/list/${number}`);
      console.log(`${number}번 게시물 클릭으로 조회수 증가`);
    } catch (error) {
      console.error("조회수를 증가시키는 데 실패했습니다.");
    }
  };

  const handleWriteClick = () => {
    navigate("/board/add");
  };

  function MultipleItems() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    return (
      <Box>
        <h3>게시물 목록</h3>

        {/* 검색 필터 */}
        <HStack mb={4} justifyContent="center">
          <NativeSelectRoot
            width="240px"
            maxW="120px"
            W="120px"
            maxH="50"
            H="50"
          >
            <NativeSelectField
              value={site} // **
              onChange={(e) => setSite(e.target.value)}
            >
              <option value={"allSite"}>민물/바다</option>
              <option value={"riverSite"}>민물낚시</option>
              <option value={"seaSite"}>바다낚시</option>
            </NativeSelectField>
          </NativeSelectRoot>

          <NativeSelectRoot
            width="240px"
            maxW="100px"
            W="120px"
            maxH="50"
            H="50"
          >
            <NativeSelectField
              value={type} // **
              onChange={(e) => setType(e.target.value)}
            >
              <option value={"all"}>전체</option>
              <option value={"title"}>제목</option>
              <option value={"content"}>본문</option>
              <option value={"writer"}>작성자</option>
            </NativeSelectField>
          </NativeSelectRoot>

          <Input
            placeholder="검색어를 입력하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            maxW="700px"
            w="100%"
            maxH="50"
            H="50"
          />
          <IconButton
            aria-label="Search database"
            onClick={(e) => setSearchParams({ type, keyword, site })} // **
            maxH="50"
            H="30"
          >
            <LuSearch />
          </IconButton>
        </HStack>

        {/* 조회수 상위 3개 데이터 표시 */}
        <div className="slider-container">
          <Slider {...settings}>
            <div>
              <Box
                mb={8}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                p={4}
              >
                <h3>조회수 Top 3</h3>
                {/* 조회수가 높은 게시물 카드 형태로 표시 */}
                <SimpleGrid columns={[1, null, 3]} gap="40px" mt={4}>
                  {topBoards.slice(0, 3).map((board) => (
                    <Card.Root key={board.number} width="250px">
                      <Card.Body gap="2">
                        <Image
                          rounded="md"
                          src="https://bit.ly/dan-abramov"
                          alt="Dan Abramov"
                        />
                        <HStack justifyContent="space-between" mt="1">
                          <Text fontSize="sm" color="gray.500">
                            {board.site}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            Views: {board.viewCount}
                          </Text>
                        </HStack>
                        <Card.Title mt="2">{board.title}</Card.Title>
                        <Text fontSize="sm" color="gray.500" mt="1">
                          {board.writer}
                        </Text>
                        <Card.Description>{board.content}</Card.Description>
                      </Card.Body>
                      <Card.Footer justifyContent="flex-end">
                        <Button
                          variant="outline"
                          onClick={() => handleRowClick(board.number)}
                          key={board.number}
                        >
                          View
                        </Button>
                      </Card.Footer>
                    </Card.Root>
                  ))}
                </SimpleGrid>
              </Box>
            </div>
            <div>
              <Box
                mb={8}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                p={4}
              >
                <h3>인기 게시글 Top3</h3>
              </Box>
            </div>
          </Slider>
        </div>

        {/* 일반 게시물 목록 */}
        {isLoading ? (
          <Center h="50vh">
            <HStack gap="5">
              <Spinner size="xl" />
            </HStack>
          </Center>
        ) : errorMessage ? (
          <Alert title="Alert Title" icon={<LuTerminal />}>
            데이터를 불러오는 데 실페하였습니다.
          </Alert>
        ) : boardList.length === 0 ? ( // ** 검색 결과 없음 조건
          <Center flexDirection="column" gap={2} mt="35px">
            <h2>해당 게시글이 없습니다.</h2>
            <Box
              as="p"
              fontSize="sm"
              color="gray.600"
              mt={2}
              textAlign="center"
            >
              검색어를 수정하시거나, 다른 조건으로 검색해주세요.
            </Box>
          </Center>
        ) : (
          <Table.Root interactive>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>번호</Table.ColumnHeader>
                <Table.ColumnHeader>낚시 장소</Table.ColumnHeader>
                <Table.ColumnHeader>제목</Table.ColumnHeader>
                <Table.ColumnHeader>본문</Table.ColumnHeader>
                <Table.ColumnHeader>작성자</Table.ColumnHeader>
                <Table.ColumnHeader>조회수</Table.ColumnHeader>
                <Table.ColumnHeader>작성일시</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {boardList.map((board) => (
                <Table.Row
                  key={board.number}
                  onClick={() => handleRowClick(board.number)} // 클릭 이벤트 핸들러 추가
                  cursor="pointer" // 클릭 가능하다는 시각적 표시
                  _hover={{ bg: "gray.100" }}
                >
                  <Table.Cell>{board.number}</Table.Cell>
                  <Table.Cell>{board.site}</Table.Cell>
                  <Table.Cell>{board.title}</Table.Cell>
                  <Table.Cell>{board.content}</Table.Cell>
                  <Table.Cell>{board.writer}</Table.Cell>
                  <Table.Cell>{board.viewCount}</Table.Cell>
                  <Table.Cell>{board.date}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
        {/*페이지 네이션*/}

        <Box mt={5} mb={5}>
          <HStack spacing={10} justifyContent="space-between">
            {/* 페이지네이션 중앙 정렬 */}
            <HStack gap="4" justifyContent="center" flex="1" ml="150px">
              <PaginationRoot
                onPageChange={handlePageChange}
                count={count}
                pageSize={10}
                page={page}
              >
                <PaginationPrevTrigger />
                <PaginationItems />
                <PaginationNextTrigger />
              </PaginationRoot>
            </HStack>

            {/* 버튼 왼쪽 끝에 정렬 */}
            <Flex justifyContent="flex-start" mr="115px">
              <Button variant="surface" onClick={handleWriteClick}>
                게시글 작성
              </Button>
            </Flex>
          </HStack>
        </Box>
      </Box>
    );
  }

  return <MultipleItems />;
}

export default BoardList;
