package com.example.backend.mapper.board;

import com.example.backend.dto.board.Board;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Select("""
                <script>
                SELECT 
                    board_number AS number, 
                    board_title AS title, 
                    board_writer AS writer, 
                    board_view_count AS viewCount, 
                    board_date AS date,
                    board_content AS content,
                    board_site AS site
                FROM board
                WHERE 
                    <choose>
                        <when test="site == 'allSite'">
                            board_site IN ('민물낚시', '바다낚시')
                        </when>
                        <when test="site == 'riverSite'">
                            board_site = '민물낚시'
                        </when>
                        <when test="site == 'seaSite'">
                            board_site = '바다낚시'
                        </when>
                        <otherwise>
                            1=1-- site 값이 없을 경우 전체 검색
                        </otherwise>
                    </choose>
                            <if test="keyword != null and keyword != ''">
                              AND (  
                                <choose>
                                    <when test="type == 'title'">
                                        board_title LIKE CONCAT('%', #{keyword}, '%')
                                    </when>
                                    <when test="type == 'content'">
                                        board_content LIKE CONCAT('%', #{keyword}, '%')
                                    </when>
                                    <when test="type == 'writer'">
                                        board_writer LIKE CONCAT('%', #{keyword}, '%')
                                    </when>
                                    <otherwise>
                                        (board_title LIKE CONCAT('%', #{keyword}, '%') OR 
                                         board_content LIKE CONCAT('%', #{keyword}, '%') OR 
                                         board_writer LIKE CONCAT('%', #{keyword}, '%'))
                                    </otherwise>
                                </choose>
                                  )
                            </if>
                ORDER BY board_number DESC
                LIMIT #{offset}, 10        
                    </script>
            """)
    List<Board> findAllBoards(@Param("keyword") String keyword,
                              @Param("type") String type,
                              @Param("site") String site,
                              Integer offset);

    @Select("""
                SELECT
                    board_number AS number,
                    board_title AS title,
                    board_writer AS writer,
                    board_view_count AS viewCount,
                    board_date AS date,
                    board_content AS content,
                    board_site AS site
                FROM board
                ORDER BY board_view_count DESC
                LIMIT 3
            """)
    List<Board> findTopBoardsByViews();


    @Update("""
            UPDATE board
            SET board_view_count = board_view_count + 1
            WHERE board_number = #{number}
            """)
    void updateViewCount(@Param("number") Integer number);

    @Select("""
            SELECT COUNT(*) FROM board
            """)
    Integer countAll();

    @Insert("""
                    INSERT INTO board
                    (board_title, board_content, board_writer, board_site)
                    VALUES (#{title}, #{content}, #{writer}, #{site})
            """)
    @Options(keyProperty = "number", useGeneratedKeys = true)
    int insert(Board board);

    @Insert("""
                    INSERT INTO board_file
                    VALUES (#{id}, #{fileName});
            """)
    void insertFile(Integer id, String fileName);

    @Select("""
                        SELECT 
                        board_number number,
                        board_title title, 
                        board_writer writer, 
                        board_date AS date,
                        board_content content,
                        board_site site
                                    FROM board
                                    WHERE board_number = #{number}
            """)
    Board selectById(int number);

    @Select("""
            SELECT name 
            FROM board_file
            WHERE board_id = #{number}
            """)
    List<String> selectFilesByBoardId(int number);

    @Delete("""
                    DELETE
                    FROM board
                    WHERE board_number = #{number}
            """)
    int deleteById(int number);
}
