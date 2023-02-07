import { AppBar } from 'climbingweb/src/components/common/AppBar';
import { ListSheet } from 'climbingweb/src/components/common/BottomSheetContents/ListSheet/ListSheet';
import { NormalButton } from 'climbingweb/src/components/common/button/Button';
import { DropDown } from 'climbingweb/src/components/common/DropDown';
import {
  BackButton,
  Empty,
} from 'climbingweb/src/components/common/AppBar/IconButton';
import TextArea from 'climbingweb/src/components/common/TextArea/TextArea';
import { useEffect, useRef, useState } from 'react';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { useRouter } from 'next/router';
import { useCreateReport } from 'climbingweb/src/hooks/queries/post/queryKey';
import { useToast } from 'climbingweb/src/hooks/useToast';
import { useBnbHide } from 'climbingweb/src/hooks/useBnB';

export default function ReportPage({}) {
  const router = useRouter();
  const { fid } = router.query;
  //fid string 거르는 로직, useRouter 에 대해 자세히 보고 추후 반드시 변경 해야함
  const feedId = fid as string;
  const { toast } = useToast();

  const contentInputRef = useRef<HTMLTextAreaElement>(null);

  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState<
    '부적절한 게시글' | '부적절한 닉네임' | '잘못된 암장 선택'
  >('부적절한 게시글');

  const { mutate: createCenterReportMutate, isSuccess } =
    useCreateReport(feedId);

  //바텀 시트 open/ close handler
  const handleOpen = () => {
    setOpen(true);
  };
  const handleDismiss = () => {
    setOpen(false);
  };

  //바텀 시트 선택 handler
  const handleSheetSelect = (
    selectedData: '부적절한 게시글' | '부적절한 닉네임' | '잘못된 암장 선택'
  ) => {
    setReportType(selectedData);
    setOpen(false);
  };

  //완료 버튼 클릭 handler
  const handlerSubmit = () => {
    if (contentInputRef.current) {
      createCenterReportMutate({
        reportType: reportType,
        content: contentInputRef.current.value,
      });
      if (isSuccess) {
        toast('입력 완료 되었습니다.');
      } else {
        toast('입력 실패 하였습니다.');
      }
    }
  };
  //Bottom Navigation Bar 가리기
  useBnbHide();
  
  return (
    <section className="mb-footer">
      <AppBar leftNode={<BackButton />} title="" rightNode={<Empty />} />
      <div className="px-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-lg font-extrabold leading-6">신고 사유</h2>
          <DropDown
            value={reportType}
            onSheetOpen={handleOpen}
            placeholder="신고 사유를 선택해주세요"
          />
        </div>
        <div className="flex flex-col gap-2.5">
          <h2 className="text-lg font-extrabold leading-6">신고 내용</h2>
          <TextArea
            refObj={contentInputRef}
            placeholder="요청 내용을 자세히 입력해주세요."
          />
        </div>
        <NormalButton
          onClick={() => {
            handlerSubmit();
          }}
        >
          완료
        </NormalButton>
      </div>
      <BottomSheet open={open} onDismiss={handleDismiss}>
        <ListSheet
          headerTitle={'신고 사유'}
          list={['부적절한 게시글', '부적절한 닉네임', '잘못된 암장 선택']}
          onSelect={handleSheetSelect}
        />
      </BottomSheet>
    </section>
  );
}
