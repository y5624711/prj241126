package com.example.backend.service.board;

import com.example.backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardService {

    final BoardMapper mapper;

    public List<String> tagList() {

        return mapper.selectALlTag();
    }

    ;
}
