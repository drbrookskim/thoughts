const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function checkBrunch() {
  const brunchUrl = 'https://brunch.co.kr/@drbrooks';
  
  try {
    // 1. 브런치 프로필 페이지 HTML 가져오기
    const { data } = await axios.get(brunchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const $ = cheerio.load(data);
    
    // 2. 최신 글 링크 및 제목 추출
    const latestPostLink = $('.list_article li a').first().attr('href'); 
    const latestPostTitle = $('.list_article li .tit_subject').first().text().trim();
    
    if (!latestPostLink) {
      console.log('브런치에서 글을 찾을 수 없습니다. 선택자를 확인해주세요.');
      return;
    }
    
    const fullLink = `https://brunch.co.kr${latestPostLink}`;
    const postId = latestPostLink.split('/').pop(); // 글 고유 ID (예: 12)
    
    // 3. 저장할 마크다운 파일 경로 설정 (_posts 또는 thoughts 폴더)
    const targetDir = path.join(__dirname, 'thoughts');
    
    // 폴더가 없다면 생성
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    
    const filePath = path.join(targetDir, `brunch-${postId}.md`);
    
    // 4. 중복 체크 (이미 등록된 글이면 스킵)
    if (fs.existsSync(filePath)) {
      console.log('새로운 브런치 글이 없습니다. 최신 상태입니다.');
      return;
    }
    
    // 5. 마크다운 파일 내용 생성 (Front Matter 포함)
    const content = `---
title: "${latestPostTitle}"
date: ${new Date().toISOString().split('T')[0]}
link: "${fullLink}"
category: thoughts
---

브런치스토리에 새로운 글이 등록되었습니다. 아래 링크에서 전체 내용을 확인하실 수 있습니다.

👉 [브런치에서 전체 글 읽기](${fullLink})
`;
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`🎉 새 글 등록 완료: ${latestPostTitle}`);
    
  } catch (error) {
    console.error('❌ 브런치 크롤링 중 에러 발생:', error.message);
  }
}

checkBrunch();
