import { Box, Button, Input, Spinner, Stack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";

export function MemberInfo() {
  const [member, setMember] = useState(null);
  const { id } = useParams();
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { hasAccess } = useContext(AuthenticationContext);

  useEffect(() => {
    //회원정보 얻기
    axios.get(`/api/member/${id}`).then((res) => setMember(res.data));
  }, []);

  function handleDeleteClick() {
    axios
      .delete("/api/member/remove", {
        data: { id, password },
      })
      .then((res) => {
        const message = res.data.message;

        toaster.create({
          type: message.type,
          description: message.text,
        });
        navigate("/member/signup");
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
        setPassword("");
      });
  }

  if (!member) {
    return <Spinner />;
  }

  return (
    <Box px="20px" mx={"auto"} w={{ md: "500px" }}>
      <h3>회원 정보</h3>

      <Stack gap={5} p="5" bg="blue.200" borderRadius="md">
        <Field label={"아이디"}>
          <Input
            readOnly
            value={member.id}
            mx={"auto"}
            w={{ md: "100%" }}
            style={{ color: "gray" }}
          />
        </Field>
        <Field label={"암호"}>
          <Input
            readOnly
            value={member.password}
            mx={"auto"}
            w={{ md: "100%" }}
            style={{ color: "gray" }}
          />
        </Field>
        <Field label={"이름"}>
          <Input
            readOnly
            value={member.name}
            mx={"auto"}
            w={{ md: "100%" }}
            style={{ color: "gray" }}
          />
        </Field>
        <Field label={"이메일"}>
          <Input
            readOnly
            value={member.email}
            mx={"auto"}
            w={{ md: "100%" }}
            style={{ color: "gray" }}
          />
        </Field>
        <Field label={"번호"}>
          <Input
            readOnly
            value={member.phone}
            mx={"auto"}
            w={{ md: "100%" }}
            style={{ color: "gray" }}
          />
        </Field>
        <Field label={"생일"}>
          <Input
            readOnly
            value={member.birth}
            mx={"auto"}
            w={{ md: "100%" }}
            style={{ color: "gray" }}
          />
        </Field>
        <Field label={"우편번호"}>
          <Input
            readOnly
            value={member.post}
            mx={"auto"}
            w={{ md: "100%" }}
            style={{ color: "gray" }}
          />
        </Field>
        <Field label={"주소"}>
          <Input
            readOnly
            value={member.address}
            mx={"auto"}
            w={{ md: "100%" }}
            style={{ color: "gray" }}
          />
        </Field>
        <Field label={"가입일시"}>
          <Input
            readOnly
            value={member.inserted}
            mx={"auto"}
            w={{ md: "100%" }}
            style={{ color: "gray" }}
          />
        </Field>
        <Box textAlign="center">
          <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
            <DialogTrigger asChild>
              <div>
                {hasAccess(member.id) && (
                  <Box mb={2}>
                    {" "}
                    {/* 간격을 2로 줄임 */}
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
                      onClick={() => navigate(`/member/edit/${id}`)}
                    >
                      수정
                    </button>
                  </Box>
                )}
                <Box mb={2}>
                  {" "}
                  {/* 간격을 2로 줄임 */}
                  <button
                    style={{
                      backgroundColor: "#5ed0da",
                      color: "#fff",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      width: "385px", // 폭 고정
                      display: "block", // 블록 요소 설정
                      margin: "0 auto", // 가운데 정렬
                    }}
                    onClick={() => navigate(`/board/written/${id}`)}
                  >
                    내 작성글
                  </button>
                </Box>
                <Box>
                  <button
                    style={{
                      backgroundColor: "#ff5b5b",
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
                    탈퇴
                  </button>
                </Box>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>탈퇴확인</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <p>탈퇴 하시겠습니까?</p>
                <p
                  style={{
                    fontSize: "0.8em",
                    marginTop: "0.5em",
                    color: "#ff5b5b",
                  }}
                >
                  비밀번호 입력 시 탈퇴가 완료됩니다.
                </p>
                <Stack gap={5}>
                  <Field>
                    <Input
                      placeholder={"비밀번호를 입력해주세요."}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Field>
                </Stack>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger>
                  <Button variant={"outline"}>취소</Button>
                </DialogActionTrigger>
                <button
                  style={{
                    backgroundColor: "#989e7d",
                    color: "#fff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: "385px", // 폭 고정
                    display: "block", // 블록 요소 설정
                    margin: "0 auto", // 가운데 정렬
                  }}
                  onClick={handleDeleteClick}
                >
                  탈퇴
                </button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </Box>
      </Stack>
    </Box>
  );
}
