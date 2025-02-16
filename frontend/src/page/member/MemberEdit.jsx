import {
  Box,
  Button,
  Group,
  Heading,
  Input,
  Span,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Field } from "../../components/ui/field.jsx";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import DaumPostcodeEmbed from "react-daum-postcode";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";

export function MemberEdit() {
  const { id } = useParams();
  // 데이터 받기
  const [member, setMember] = useState(null);
  // 수정 대상 데이터
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [post, setPost] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  // 수정시 비밀번호 수정
  const [oldPassword, setOldPassword] = useState("");
  // 유효성 만족시 open
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  // 이메일 오류 상태
  const [emailError, setEmailError] = useState(false);
  // 이메일 메시지 상태
  const [emailMessage, setEmailMessage] = useState("");

  //우편번호 api
  const [isOpen, setIsOpen] = useState(false);
  // 보안
  const { hasAccess } = useContext(AuthenticationContext);

  useEffect(() => {
    axios.get(`/api/member/${id}`).then((res) => {
      setMember(res.data);
      setPassword(res.data.password);
      setPost(res.data.post);
      setPhone(res.data.phone);
      setAddress(res.data.address);
      setEmail(res.data.email);
    });
  }, []);

  // 수정 버튼 클릭시 업데이트 + 토스터
  function handleSaveClick() {
    axios
      .put("/api/member/update", {
        id: member.id,
        password,
        post,
        address,
        email,
        oldPassword,
        phone,
      })
      .then((res) => {
        const message = res.data.message;

        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate(`/member/${id}`);
      })
      .catch((e) => {
        const message = e.response.data.message;

        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        setOpen(false);
        setOldPassword("");
      });
  }

  //로딩
  if (member === null) {
    return <Spinner />;
  }

  //이메일 정규식
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const emailRegex =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{3}$/i;

    if (!emailRegex.test(value)) {
      setEmailError(false);
      setEmailMessage("유효하지 않은 이메일 형식입니다");
    } else {
      setEmailError(true);
      setEmailMessage("올바른 이메일 형식입니다.");
    }
  };

  //전화번호 정규식
  function regPhoneNumber(e) {
    const result = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3")
      .replace(/(-{1,2})$/g, "");
    setPhone(result);
  }

  // 우편 api
  const handleApi = () => {
    setIsOpen(true);
  };
  const handleComplete = (e) => {
    const { address, zonecode } = e;
    setPost(zonecode); // 선택된 우편번호 저장
    setAddress(address); // 선택된 상세주소 저장
  };
  const handleClose = (e) => {
    if (e === "FORCE_CLOSE") {
      setIsOpen(false);
    } else if (e === "COMPLETE_CLOSE") {
      setIsOpen(false);
    }
  };
  const handleButtonClose = () => {
    setIsOpen(false);
  };

  return (
    <Box px="20px" mx={"auto"} w={{ md: "500px" }}>
      <Heading>내 정보 수정</Heading>
      {hasAccess(member.id) && (
        <Stack gap={5} p="5" bg="blue.200">
          <Field readOnly label={"아이디"}>
            <Input
              readOnly
              defaultValue={member.id}
              style={{ color: "gray" }}
            />
          </Field>
          <Field label={"암호"}>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="subtle"
            />
          </Field>
          <Field readOnly label={"이름"}>
            <Input
              readOnly
              style={{ color: "gray" }}
              value={member.name}
              maxW="550px"
            />
          </Field>
          <Field label={"이메일"}>
            <Input
              value={email}
              onChange={handleEmailChange}
              maxW="550px"
              variant="subtle"
            />
            <Span style={{ color: emailError ? "green" : "red" }}>
              {emailMessage}
            </Span>
          </Field>
          <Field label={"전화번호"}>
            <Input
              value={phone}
              onChange={regPhoneNumber}
              variant="subtle"
              maxW="550px"
            />
          </Field>
          <Field readOnly label={"생일"}>
            <Input
              readOnly
              value={member.birth}
              style={{ color: "gray" }}
              maxW="550px"
            />
          </Field>
          <Box>
            <Field label={"우편번호"}>
              <Group>
                <Input
                  value={post}
                  readOnly
                  onChange={(e) => setPost(e.target.value)}
                  variant="subtle"
                />
                <DialogRoot>
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsOpen(true)}>
                      우편번호 찾기
                    </Button>
                  </DialogTrigger>
                  {isOpen && (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>우편번호 검색</DialogTitle>
                      </DialogHeader>
                      <DialogBody pb="4">
                        <Field mt="5">
                          <DaumPostcodeEmbed
                            onComplete={handleComplete}
                            onClose={handleClose}
                          />
                        </Field>
                      </DialogBody>
                      <DialogFooter>
                        <DialogActionTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                          >
                            닫기
                          </Button>
                        </DialogActionTrigger>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </DialogRoot>
              </Group>
            </Field>

            <Field label={"상세주소"}>
              <Input
                value={address}
                readOnly
                onChange={(e) => setAddress(e.target.value)}
                variant="subtle"
                maxW="550px"
              />
            </Field>
          </Box>
          <Field readOnly label={"가입일시"}>
            <Input
              defaultValue={member.id}
              style={{ color: "gray" }}
              value={member.inserted}
              maxW="550px"
            />
          </Field>
          <Box>
            <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
              <DialogTrigger asChild>
                <button
                  style={{
                    backgroundColor: "#6276c6",
                    color: "#fff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: "385px", // 폭 고정
                    display: "block", // 블록 요소 설정
                    margin: "0 auto", // 가운데 정렬
                  }}
                >
                  저장
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>회원 정보 변경 확인</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <Stack gap={5}>
                    <Field label={"기존 암호"}>
                      <Input
                        placeholder={"기존 암호를 입력해주세요."}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                    </Field>
                  </Stack>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger>
                    <Button variant={"outline"}>취소</Button>
                  </DialogActionTrigger>
                  <Box>
                    <button
                      style={{
                        backgroundColor: "#6276c6",
                        color: "#fff",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        width: "385px", // 폭 고정
                        display: "block", // 블록 요소 설정
                        margin: "0 auto", // 가운데 정렬
                      }}
                      onClick={handleSaveClick}
                    >
                      저장
                    </button>
                  </Box>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          </Box>
        </Stack>
      )}
    </Box>
  );
}
