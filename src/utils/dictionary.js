import { vocabData } from '../data/vocabData.js';

// Extended Academic & Exam Vocabulary Dictionary for English Final & Test 2
const examVocabList = [
  // Test 2 - Part 1: Marie Curie & Scientific Research
  { word: "gravity", pos: "noun", thai: "แรงโน้มถ่วง, แรงดึงดูดของโลก", ipa: "/ˈɡrævəti/", example: "Isaac Newton formulated the universal law of gravity." },
  { word: "radioactivity", pos: "noun", thai: "กัมมันตภาพรังสี", ipa: "/ˌreɪdiəʊækˈtɪvəti/", example: "Marie Curie conducted groundbreaking research on radioactivity." },
  { word: "groundbreaking", pos: "adj.", thai: "ที่เป็นการบุกเบิกใหม่, ที่สร้างปรากฏการณ์ใหม่", ipa: "/ˈɡraʊndˌbreɪkɪŋ/", example: "Her groundbreaking discoveries changed physics forever." },
  { word: "anatomy", pos: "noun", thai: "กายวิภาคศาสตร์, โครงสร้างร่างกาย", ipa: "/əˈnætəmi/", example: "Medical students must complete rigorous courses in human anatomy." },
  { word: "telephone", pos: "noun", thai: "โทรศัพท์", ipa: "/ˈtelɪfəʊn/", example: "Alexander Graham Bell is credited with inventing the telephone." },
  { word: "savings", pos: "noun", thai: "เงินออม, เงินเก็บสะสม", ipa: "/ˈseɪvɪŋz/", example: "Her father lost his savings due to poor investments." },
  { word: "investment", pos: "noun", thai: "การลงทุน", ipa: "/ɪnˈvestmənt/", example: "Careful investment of funds ensures long-term financial security." },
  { word: "remarkable", pos: "adj.", thai: "น่าทึ่ง, โดดเด่นเป็นพิเศษ, ยอดเยี่ยม", ipa: "/rɪˈmɑːkəbl/", example: "She showed remarkable intelligence and determination." },
  { word: "impressive", pos: "adj.", thai: "น่าประทับใจ, น่าเกรงขาม, โดดเด่น", ipa: "/ɪmˈpresɪv/", example: "His academic record was truly impressive." },
  { word: "ordinary", pos: "adj.", thai: "ธรรมดา, ทั่วไป, ปกติ", ipa: "/ˈɔːdnri/", example: "It was just an ordinary day before the big discovery." },
  { word: "unimportant", pos: "adj.", thai: "ไม่สำคัญ, ไร้ความสำคัญ", ipa: "/ˌʌnɪmˈpɔːtnt/", example: "Do not waste time on unimportant details." },
  { word: "secondary", pos: "adj.", thai: "ระดับมัธยมศึกษา, เป็นรอง", ipa: "/ˈsekəndri/", example: "She finished her secondary education with high honors." },
  { word: "medical", pos: "adj.", thai: "ทางการแพทย์, เกี่ยวกับการรักษาโรค", ipa: "/ˈmedɪkl/", example: "She funded her sister's medical studies in Paris." },
  { word: "pursue", pos: "verb", thai: "ไล่ตาม, มุ่งศึกษาต่อ, ติดตาม", ipa: "/pəˈsjuː/", example: "She moved abroad to pursue her higher education." },
  { word: "devote", pos: "verb", thai: "อุทิศ, ทุ่มเท (มักใช้ devote oneself to)", ipa: "/dɪˈvəʊt/", example: "She devoted herself completely to scientific research." },
  { word: "dedicated", pos: "adj.", thai: "ที่ทุ่มเท, ที่อุทิศตน", ipa: "/ˈdedɪkeɪtɪd/", example: "He is a dedicated professor who supports all his students." },
  { word: "survive", pos: "verb", thai: "รอดชีวิต, ดำรงชีวิตอยู่ได้", ipa: "/səˈvaɪv/", example: "She survived on a simple diet of bread and tea." },
  { word: "exceptionally", pos: "adv.", thai: "อย่างยอดเยี่ยมเป็นเลิศ, เป็นพิเศษ", ipa: "/ɪkˈsepʃənəli/", example: "She performed exceptionally well on her examinations." },
  { word: "examination", pos: "noun", thai: "การสอบ, การตรวจสอบ", ipa: "/ɪɡˌzæmɪˈneɪʃn/", example: "Students prepared thoroughly for the final examination." },
  { word: "partnership", pos: "noun", thai: "ความเป็นหุ้นส่วน, การเป็นพันธมิตรร่วมมือกัน", ipa: "/ˈpɑːtnəʃɪp/", example: "Their research partnership resulted in a Nobel Prize." },
  { word: "determined", pos: "adj.", thai: "เด็ดเดี่ยว, มุ่งมั่นแน่วแน่", ipa: "/dɪˈtɜːmɪnd/", example: "A determined student overcomes every obstacle." },
  { word: "hardworking", pos: "adj.", thai: "ขยันขันแข็ง, ทำงานหนัก", ipa: "/ˌhɑːdˈwɜːkɪŋ/", example: "Hardworking candidates always stand out in interviews." },
  { word: "wealthy", pos: "adj.", thai: "ร่ำรวย, มีฐานะดี", ipa: "/ˈwelθi/", example: "She came from an educated but not wealthy family." },
  { word: "privileged", pos: "adj.", thai: "มีสิทธิพิเศษ, ได้รับโอกาสเหนือกว่า", ipa: "/ˈprɪvəlɪdʒd/", example: "Higher education was once reserved for privileged classes." },
  { word: "sacrifice", pos: "noun/verb", thai: "การเสียสละ, เสียสละเพื่อเป้าหมาย", ipa: "/ˈsækrɪfaɪs/", example: "Her parents made many sacrifices for her education." },

  // Test 2 - Part 2: Work-Study, Loans & Advising
  { word: "freshman", pos: "noun", thai: "นักศึกษาปีที่ 1 (first-year student)", ipa: "/ˈfreʃmən/", example: "Orientation is mandatory for every incoming freshman." },
  { word: "sophomore", pos: "noun", thai: "นักศึกษาปีที่ 2 (second-year student)", ipa: "/ˈsɒfəmɔː/", example: "As a sophomore, she declared her academic major." },
  { word: "junior", pos: "noun", thai: "นักศึกษาปีที่ 3 (third-year student)", ipa: "/ˈdʒuːniə/", example: "Junior students often undertake internship placements." },
  { word: "senior", pos: "noun", thai: "นักศึกษาปีที่ 4 (fourth-year student)", ipa: "/ˈsiːniə/", example: "Senior students must complete a graduation thesis." },
  { word: "loan", pos: "noun", thai: "เงินกู้, หนี้กู้ยืมเพื่อการศึกษา", ipa: "/ləʊn/", example: "Students often take out government loans for tuition." },
  { word: "debt", pos: "noun", thai: "หนี้สิน, ภาระหนี้", ipa: "/det/", example: "She worked part-time to avoid graduating in debt." },
  { word: "burden", pos: "noun/verb", thai: "ภาระ, เป็นภาระหนัก", ipa: "/ˈbɜːdn/", example: "High student debt is a heavy financial burden." },
  { word: "schedule", pos: "noun", thai: "ตารางเรียน, กำหนดการ", ipa: "/ˈʃedjuːl/", example: "Taking five lab modules created a hectic class schedule." },
  { word: "workload", pos: "noun", thai: "ปริมาณงาน, ภาระงานที่ต้องรับผิดชอบ", ipa: "/ˈwɜːkləʊd/", example: "The professor reduced the reading workload before midterms." },
  { word: "approve", pos: "verb", thai: "อนุมัติ, เห็นชอบ", ipa: "/əˈpruːv/", example: "The advisor approved his course registration form." },
  { word: "qualify", pos: "verb", thai: "มีคุณสมบัติผ่านเกณฑ์, ได้รับสิทธิ์", ipa: "/ˈkwɒlɪfaɪ/", example: "You need a 3.5 GPA to qualify for the honors fellowship." },
  { word: "reconsider", pos: "verb", thai: "พิจารณาใหม่อีกครั้ง, ทบทวน", ipa: "/ˌriːkənˈsɪdə/", example: "The committee agreed to reconsider the rejected proposal." },
  { word: "suitable", pos: "adj.", thai: "เหมาะสม, คู่ควร", ipa: "/ˈsuːtəbl/", example: "The job center matched him with a suitable campus role." },

  // Test 2 - Part 3: Street Scene, City & Transportation
  { word: "numerous", pos: "adj.", thai: "จำนวนมาก, มากมาย", ipa: "/ˈnjuːmərəs/", example: "There are numerous bicycles parked along the avenue." },
  { word: "destination", pos: "noun", thai: "จุดหมายปลายทาง, แหล่งท่องเที่ยว", ipa: "/ˌdestɪˈneɪʃn/", example: "Bangkok is a renowned international tourist destination." },
  { word: "transportation", pos: "noun", thai: "การคมนาคม, การขนส่ง, ยานพาหนะ", ipa: "/ˌtrænspɔːˈteɪʃn/", example: "Public transportation reduces inner-city carbon emissions." },
  { word: "cyclist", pos: "noun", thai: "นักปั่นจักรยาน", ipa: "/ˈsaɪklɪst/", example: "Dedicated cycle tracks protect cyclists from fast traffic." },
  { word: "chaotic", pos: "adj.", thai: "โกลาหล, วุ่นวายไร้ระเบียบ", ipa: "/keɪˈɒtɪk/", example: "The intersection was chaotic during the torrential storm." },
  { word: "commercial", pos: "adj.", thai: "เชิงพาณิชย์, ย่านธุรกิจ", ipa: "/kəˈmɜːʃl/", example: "The downtown zone is packed with commercial enterprises." },
  { word: "depict", pos: "verb", thai: "พรรณนา, แสดงภาพ, บรรยาย", ipa: "/dɪˈpɪkt/", example: "The photograph depicts a lively open-air street market." },
  { word: "indicate", pos: "verb", thai: "บ่งชี้, แสดงให้เห็น", ipa: "/ˈɪndɪkeɪt/", example: "Long vehicle queues indicate congested road conditions." },

  // Test 2 - Part 4: Greenfield Chocolate Email & Business Terms
  { word: "anniversary", pos: "noun", thai: "วันครบรอบปี", ipa: "/ˌænɪˈvɜːsəri/", example: "The company celebrates its fiftieth golden anniversary." },
  { word: "proceeds", pos: "noun", thai: "รายได้ที่ได้จากการจัดงานหรือขายตั๋ว", ipa: "/ˈprəʊsiːdz/", example: "All proceeds from the charity raffle will fund schools." },
  { word: "raffle", pos: "noun", thai: "การจับสลากชิงโชคการกุศล", ipa: "/ˈræfl/", example: "She bought three raffle tickets to support animal welfare." },
  { word: "complimentary", pos: "adj.", thai: "ที่ให้ฟรี (อภินันทนาการ)", ipa: "/ˌkɒmplɪˈmentri/", example: "Guests received complimentary fruit baskets upon arrival." },
  { word: "luxury", pos: "adj./noun", thai: "หรูหรา, ความฟุ่มเฟือยสะดวกสบาย", ipa: "/ˈlʌkʃəri/", example: "The grand prize includes a three-night luxury resort stay." },
  { word: "charity", pos: "noun", thai: "การกุศล, องค์กรการกุศล", ipa: "/ˈtʃærəti/", example: "The foundation donates books to regional rural charities." },
  { word: "foundation", pos: "noun", thai: "มูลนิธิ, พื้นฐาน", ipa: "/faʊnˈdeɪʃn/", example: "The Bill Gates Foundation funds global vaccine initiatives." },
  { word: "grand prize", pos: "noun", thai: "รางวัลใหญ่ที่สุด, รางวัลชนะเลิศ", ipa: "/ɡrænd praɪz/", example: "The grand prize is an all-inclusive trip to Thailand." },
  { word: "discount", pos: "noun/verb", thai: "ส่วนลด, ลดราคา", ipa: "/ˈdɪskaʊnt/", example: "Students get a ten percent discount on books." },

  // Test 2 - Part 5: Academic Dialogue, Grammar & Context
  { word: "perseverance", pos: "noun", thai: "ความพากเพียร, ความอุตสาหะ, การไม่ย่อท้อ", ipa: "/ˌpɜːsɪˈvɪərəns/", example: "Her perseverance through hardships inspired millions." },
  { word: "persistence", pos: "noun", thai: "ความมุ่งมั่นยืนหยัดอย่างต่อเนื่อง", ipa: "/pəˈsɪstəns/", example: "Persistence in scientific inquiry leads to breakthroughs." },
  { word: "hesitation", pos: "noun", thai: "ความลังเลใจ, ความไม่แน่ใจ", ipa: "/ˌhezɪˈteɪʃn/", example: "He accepted the prestigious scholarship without hesitation." },
  { word: "reluctance", pos: "noun", thai: "ความไม่เต็มใจ, ความอิดออด", ipa: "/rɪˈlʌktəns/", example: "Her reluctance to speak up delayed the project launch." },
  { word: "instability", pos: "noun", thai: "ความไม่มั่นคง, ความไม่แน่นอน", ipa: "/ˌɪnstəˈbɪləti/", example: "Economic instability affected student living grants." },
  { word: "inversion", pos: "noun", thai: "การกลับลำดับประธานกับกริยา (โครงสร้างไวยากรณ์)", ipa: "/ɪnˈvɜːʃn/", example: "Rarely has he witnessed such intense academic dedication." },
  { word: "rarely", pos: "adv.", thai: "แทบจะไม่, นานๆ ครั้ง (คำกึ่งปฏิเสธ)", ipa: "/ˈreəli/", example: "Rarely do professors grant extensions for midterm papers." },
  { word: "seldom", pos: "adv.", thai: "ไม่ค่อยจะ, นานๆ ที", ipa: "/ˈseldəm/", example: "Seldom have we observed such rapid climate disruption." },
  { word: "nevertheless", pos: "adv.", thai: "อย่างไรก็ตาม (เชื่อมความขัดแย้ง)", ipa: "/ˌnevəðəˈles/", example: "He faced tough competition; nevertheless, he prevailed." },
  { word: "consequently", pos: "adv.", thai: "ด้วยเหตุนี้, ผลที่ตามมาคือ", ipa: "/ˈkɒnsɪkwəntli/", example: "She skipped three lectures; consequently, her score suffered." },
  { word: "introductory", pos: "adj.", thai: "ระดับเบื้องต้น, ชั้นต้น", ipa: "/ˌɪntrəˈdʌktəri/", example: "Freshmen take introductory microeconomics in semester one." },
  { word: "overwhelmed", pos: "adj.", thai: "รู้สึกหนักอึ้ง, รับมือไม่ไหว", ipa: "/ˌəʊvəˈwelmd/", example: "Taking seven courses left her completely overwhelmed." },
  { word: "deadline", pos: "noun", thai: "กำหนดส่ง, วันหมดเขต", ipa: "/ˈdedlaɪn/", example: "The online submission deadline is tonight at midnight." },

  // Medical, Environment & Science Terms from Units 5-8
  { word: "hypothermia", pos: "noun", thai: "ภาวะอุณหภูมิร่างกายต่ำผิดปกติ (ต่ำกว่า 35°C)", ipa: "/ˌhaɪpəʊˈθɜːmiə/", example: "Mountaineers must guard against acute hypothermia." },
  { word: "frostbite", pos: "noun", thai: "อาการเนื้อเยื่อถูกทำลายจากความเย็นจัด", ipa: "/ˈfrɒstbaɪt/", example: "Extreme blizzards can cause severe frostbite to extremities." },
  { word: "avalanche", pos: "noun", thai: "หิมะถล่ม", ipa: "/ˈævəlɑːnʃ/", example: "Loud sound waves can trigger a devastating snow avalanche." },
  { word: "altitude", pos: "noun", thai: "ระดับความสูงเหนือน้ำทะเล", ipa: "/ˈæltɪtjuːd/", example: "High altitude induces oxygen deprivation and sickness." },
  { word: "compulsory", pos: "adj.", thai: "บังคับ, ต้องทำตามกฎหมายหรือระเบียบ", ipa: "/kəmˈpʌlsəri/", example: "Wearing laboratory protective goggles is compulsory." },
  { word: "mandatory", pos: "adj.", thai: "ที่เป็นข้อบังคับ, ที่ละเว้นไม่ได้", ipa: "/ˈmændətəri/", example: "Attendance at the ethics symposium is strictly mandatory." },
  { word: "optional", pos: "adj.", thai: "ที่เลือกได้, ไม่บังคับ", ipa: "/ˈɒpʃənl/", example: "The advanced calculus workshop is completely optional." },
  { word: "discretionary", pos: "adj.", thai: "ขึ้นอยู่กับดุลยพินิจ, ตามความสมัครใจ", ipa: "/dɪˈskreʃənri/", example: "Discretionary spending covers non-essential lifestyle goods." },
  { word: "curriculum", pos: "noun", thai: "หลักสูตรการศึกษา", ipa: "/kəˈrɪkjələm/", example: "The updated robotics curriculum stresses ethical AI." },
  { word: "syllabus", pos: "noun", thai: "ประมวลการสอนรายวิชา, โครงร่างเนื้อหาวิชา", ipa: "/ˈsɪləbəs/", example: "Review the course syllabus for assignment grading rubrics." },
  { word: "dissertation", pos: "noun", thai: "ดุษฎีนิพนธ์ (วิทยานิพนธ์ปริญญาเอก)", ipa: "/ˌdɪsəˈteɪʃn/", example: "A PhD dissertation demands original scholarly findings." },
  { word: "thesis", pos: "noun", thai: "วิทยานิพนธ์ (ระดับปริญญาโท)", ipa: "/ˈθiːsɪs/", example: "She defended her Master's thesis before the faculty panel." },
  { word: "alleviate", pos: "verb", thai: "บรรเทา, ทำให้น้อยลงหรือทุเลาลง", ipa: "/əˈliːvieɪt/", example: "Subsidies aim to alleviate poverty among rural farmers." },
  { word: "deteriorate", pos: "verb", thai: "ทรุดโทรมลง, แย่ลง", ipa: "/dɪˈtɪəriəreɪt/", example: "Air quality continues to deteriorate in urban hubs." },
  { word: "diminish", pos: "verb", thai: "ลดลง, ทำให้เล็กลง", ipa: "/dɪˈmɪnɪʃ/", example: "Rainwater reserves diminish during severe summer droughts." },
  { word: "lucrative", pos: "adj.", thai: "ที่สร้างกำไรงาม, มีผลตอบแทนสูง", ipa: "/ˈluːkrətɪv/", example: "Software architecture is a lucrative career pathway." },
  { word: "feasible", pos: "adj.", thai: "เป็นไปได้ในทางปฏิบัติ, สมเหตุสมผล", ipa: "/ˈfiːzəbl/", example: "The engineers proved the solar turbine plan was feasible." },
  { word: "preliminary", pos: "adj.", thai: "ขั้นต้น, เบื้องต้น, ขั้นเตรียมการ", ipa: "/prɪˈlɪmɪnəri/", example: "Preliminary laboratory scans confirmed our hypothesis." },
  { word: "comprehensive", pos: "adj.", thai: "ครอบคลุมทุกด้าน, ละเอียดถี่ถ้วน", ipa: "/ˌkɒmprɪˈhensɪv/", example: "The text offers a comprehensive survey of modern linguistics." },
  { word: "subsequent", pos: "adj.", thai: "ที่ตามมาในภายหลัง, ถัดจากนั้น", ipa: "/ˈsʌbsɪkwənt/", example: "Subsequent experiments validated the groundbreaking model." },

  // High Frequency Option & Reading Connectors / Verbs
  { word: "infer", pos: "verb", thai: "อนุมาน, สรุปความจากหลักฐาน", ipa: "/ɪnˈfɜː/", example: "What can the reader infer about the author's primary attitude?" },
  { word: "imply", pos: "verb", thai: "บอกเป็นนัย, สื่อความหมายทางอ้อม", ipa: "/ɪmˈplaɪ/", example: "The memo implies upcoming budget adjustments." },
  { word: "suggest", pos: "verb", thai: "ชี้แนะ, บ่งบอกเป็นนัย, แนะนำ", ipa: "/səˈdʒest/", example: "Recent climate figures suggest rising ocean heat content." },
  { word: "conclude", pos: "verb", thai: "สรุปผล, ยุติลง", ipa: "/kənˈkluːd/", example: "Researchers concluded that diet plays a paramount role." },
  { word: "emphasize", pos: "verb", thai: "เน้นย้ำ, ให้ความสำคัญเป็นพิเศษ", ipa: "/ˈemfəsaɪz/", example: "The lecturer emphasized the need for statistical precision." },
  { word: "applicant", pos: "noun", thai: "ผู้สมัคร (งาน/เข้าเรียน)", ipa: "/ˈæplɪkənt/", example: "Over five hundred applicants submitted digital portfolios." },
  { word: "tuition", pos: "noun", thai: "ค่าเล่าเรียน", ipa: "/tjuˈɪʃn/", example: "Annual university tuition covers lectures and lab access." },
  { word: "scholarship", pos: "noun", thai: "ทุนการศึกษา", ipa: "/ˈskɒləʃɪp/", example: "Full scholarships cover books, board, and tuition costs." },
  { word: "dormitory", pos: "noun", thai: "หอพักนักศึกษา", ipa: "/ˈdɔːmətri/", example: "First-year students usually reside in the campus dormitory." },
  { word: "campus", pos: "noun", thai: "บริเวณมหาวิทยาลัย, วิทยาเขต", ipa: "/ˈkæmpəs/", example: "The university campus houses advanced simulation labs." },
  { word: "semester", pos: "noun", thai: "ภาคการศึกษา, เทอม", ipa: "/sɪˈmestə/", example: "Classes resume next semester in mid-January." },
  { word: "credit", pos: "noun", thai: "หน่วยกิตการศึกษา", ipa: "/ˈkredɪt/", example: "Undergraduate degrees typically require 120 course credits." },
  { word: "attendance", pos: "noun", thai: "การเข้าเรียน, ยอดผู้เข้าร่วม", ipa: "/əˈtendəns/", example: "Regular class attendance is required to take the exam." },
  { word: "resume", pos: "noun", thai: "ประวัติส่วนตัวโดยย่อสำหรับสมัครงาน", ipa: "/ˈrezjuːmeɪ/", example: "Attach your updated resume and two reference contacts." },
  { word: "qualification", pos: "noun", thai: "คุณวุฒิ, คุณสมบัติที่เหมาะสม", ipa: "/ˌkwɒlɪfɪˈkeɪʃn/", example: "Applicants must hold recognized engineering qualifications." },

  // General & Essential Exam Vocabulary (Verbs, Nouns, Adjectives in Choices)
  { word: "discover", pos: "verb", thai: "ค้นพบ", ipa: "/dɪˈskʌvə/", example: "She discovered two new chemical elements: polonium and radium." },
  { word: "invent", pos: "verb", thai: "ประดิษฐ์คิดค้น", ipa: "/ɪnˈvent/", example: "Engineers invent innovative tools to solve everyday challenges." },
  { word: "study", pos: "verb/noun", thai: "ศึกษา, เรียนรู้, งานวิจัย", ipa: "/ˈstʌdi/", example: "She went to Paris to study physical and mathematical sciences." },
  { word: "teach", pos: "verb", thai: "สอนหนังสือ", ipa: "/tiːtʃ/", example: "She worked as a governess and tutor to teach young pupils." },
  { word: "earn", pos: "verb", thai: "หาเงินได้, ได้รับ", ipa: "/ɜːn/", example: "She used the salary she earned to support her family." },
  { word: "support", pos: "verb/noun", thai: "สนับสนุน, อุดหนุนช่วยเหลือ", ipa: "/səˈpɔːt/", example: "She worked tirelessly to support her sister's studies." },
  { word: "promise", pos: "verb/noun", thai: "สัญญา, คำมั่นสัญญา", ipa: "/ˈprɒmɪs/", example: "Her sister kept her promise and invited her to Paris." },
  { word: "science", pos: "noun", thai: "วิทยาศาสตร์", ipa: "/ˈsaɪəns/", example: "Curie achieved breakthroughs across natural science." },
  { word: "scientist", pos: "noun", thai: "นักวิทยาศาสตร์", ipa: "/ˈsaɪəntɪst/", example: "Marie Curie is one of the most famous women scientists." },
  { word: "physics", pos: "noun", thai: "วิชาฟิสิกส์", ipa: "/ˈfɪzɪks/", example: "She won the 1903 Nobel Prize in Physics." },
  { word: "chemistry", pos: "noun", thai: "วิชาเคมี", ipa: "/ˈkemɪstri/", example: "She won the 1911 Nobel Prize in Chemistry." },
  { word: "prize", pos: "noun", thai: "รางวัล", ipa: "/praɪz/", example: "Nobel prizes celebrate extraordinary intellectual achievements." },
  { word: "award", pos: "verb/noun", thai: "มอบรางวัล, รางวัลเกียรติยศ", ipa: "/əˈwɔːd/", example: "She was awarded multiple international medals." },
  { word: "medal", pos: "noun", thai: "เหรียญรางวัล", ipa: "/ˈmedl/", example: "She received a gold medal for academic excellence." },
  { word: "famous", pos: "adj.", thai: "มีชื่อเสียง, โด่งดัง", ipa: "/ˈfeɪməs/", example: "Curie is worldwide famous for her discoveries." },
  { word: "history", pos: "noun", thai: "ประวัติศาสตร์", ipa: "/ˈhɪstri/", example: "Her legacy remains unforgettable in human history." },
  { word: "husband", pos: "noun", thai: "สามี", ipa: "/ˈhʌzbənd/", example: "Pierre Curie was her beloved husband and research partner." },
  { word: "intelligence", pos: "noun", thai: "ความเฉลียวฉลาด, สติปัญญา", ipa: "/ɪnˈtelɪdʒəns/", example: "She possessed remarkable intellectual curiosity." },
  { word: "memory", pos: "noun", thai: "ความจำ, ความทรงจำ", ipa: "/ˈmeməri/", example: "She had an extraordinary memory for scientific formulas." },
  { word: "dislike", pos: "verb", thai: "ไม่ชอบ", ipa: "/dɪsˈlaɪk/", example: "He disliked memorizing facts without understanding theory." },
  { word: "travel", pos: "verb/noun", thai: "ท่องเที่ยว, เดินทาง", ipa: "/ˈtrævl/", example: "Scholars often travel abroad to present conference papers." },
  { word: "facing", pos: "verb/prep", thai: "การเผชิญหน้ากับ", ipa: "/ˈfeɪsɪŋ/", example: "Facing adversity with resilience builds strong character." },
  { word: "difficulty", pos: "noun", thai: "ความยากลำบาก, อุปสรรค", ipa: "/ˈdɪfɪkəlti/", example: "She persevered despite severe financial difficulties." },
  { word: "depend", pos: "verb", thai: "พึ่งพา, ขึ้นอยู่กับ (depend on)", ipa: "/dɪˈpend/", example: "Never depend solely on temporary luck." },
  { word: "value", pos: "verb/noun", thai: "ให้คุณค่า, ค่านิยม, คุณค่า", ipa: "/ˈvæljuː/", example: "She deeply valued education and scientific integrity." },
  { word: "willing", pos: "adj.", thai: "เต็มใจ, พร้อมที่จะ", ipa: "/ˈwɪlɪŋ/", example: "He was willing to work extra hours for his research." },
  { word: "prefer", pos: "verb", thai: "ชอบมากกว่า, พึงใจมากกว่า", ipa: "/prɪˈfɜː/", example: "I prefer working on independent laboratory projects." },
  { word: "concern", pos: "verb/noun", thai: "ความกังวล, ความเป็นห่วง", ipa: "/kənˈsɜːn/", example: "The student is deeply concerned about repaying debt." },
  { word: "strapped", pos: "adj.", thai: "ขัดสนเงิน, ขาดแคลนเงิน (strapped for cash)", ipa: "/stræpt/", example: "Many college graduates feel strapped for cash." },
  { word: "agreement", pos: "noun", thai: "ข้อตกลง, ความเห็นพ้อง", ipa: "/əˈɡriːmənt/", example: "Both parties reached a formal mutual agreement." },
  { word: "immediately", pos: "adv.", thai: "ในทันทีทันใด", ipa: "/ɪˈmiːdiətli/", example: "Call the emergency center immediately if injury occurs." },
  { word: "request", pos: "verb/noun", thai: "คำขอ, ร้องขอ", ipa: "/rɪˈkwest/", example: "The dean approved her course extension request." },
  { word: "risk", pos: "noun/verb", thai: "ความเสี่ยง, เสี่ยงอันตราย", ipa: "/rɪsk/", example: "Working over 20 hours puts your scholarship at risk." },
  { word: "library", pos: "noun", thai: "ห้องสมุด", ipa: "/ˈlaɪbrəri/", example: "Students reserve study cubicles in the central library." },
  { word: "center", pos: "noun", thai: "ศูนย์กลาง, ศูนย์บริการ", ipa: "/ˈsentə/", example: "Submit your campus employment form to the job center." },
  { word: "believe", pos: "verb", thai: "เชื่อ, มั่นใจ", ipa: "/bɪˈliːv/", example: "Advisors believe early preparation prevents anxiety." },
  { word: "lead", pos: "verb", thai: "นำไปสู่ (lead to)", ipa: "/liːd/", example: "Neglecting homework will lead to lower final grades." },
  { word: "provide", pos: "verb", thai: "จัดหาให้, มอบให้", ipa: "/prəˈvaɪd/", example: "Universities provide extensive tutoring resources." },
  { word: "bicycle", pos: "noun", thai: "จักรยาน", ipa: "/ˈbaɪsɪkl/", example: "Many students commute to classes by bicycle." },
  { word: "vehicle", pos: "noun", thai: "ยานพาหนะ, ยานยนต์", ipa: "/ˈviːəkl/", example: "Electric vehicles reduce harmful street pollution." },
  { word: "share", pos: "verb", thai: "แบ่งปัน, ใช้ร่วมกัน", ipa: "/ʃeə/", example: "Cyclists and cars share the urban avenue." },
  { word: "traffic", pos: "noun", thai: "การจราจร", ipa: "/ˈtræfɪk/", example: "Heavy morning traffic delayed the campus shuttle." },
  { word: "basket", pos: "noun", thai: "ตะกร้า (หน้ารถ)", ipa: "/ˈbɑːskɪt/", example: "She placed groceries in the bicycle basket." },
  { word: "attach", pos: "verb", thai: "ติด, แนบ (attach to)", ipa: "/əˈtætʃ/", example: "Attach your transcript to the scholarship dossier." },
  { word: "direction", pos: "noun", thai: "ทิศทาง", ipa: "/daɪˈrekʃn/", example: "Bicycles are moving smoothly in the same direction." },
  { word: "moreover", pos: "adv.", thai: "ยิ่งไปกว่านั้น, นอกจากนี้", ipa: "/mɔːrˈəʊvə/", example: "The book is insightful; moreover, it is concise." },
  { word: "designated", pos: "adj.", thai: "ที่ถูกกำหนดไว้เฉพาะ", ipa: "/ˈdezɪɡneɪtɪd/", example: "Park only in the designated bicycle zones." },
  { word: "lane", pos: "noun", thai: "ช่องทางจราจร, เลน", ipa: "/leɪn/", example: "Protected lanes ensure maximum safety for cyclists." },
  { word: "separation", pos: "noun", thai: "การแบ่งแยก, การแยกส่วน", ipa: "/ˌsepəˈreɪʃn/", example: "Physical road separation minimizes traffic collisions." },
  { word: "surrounding", pos: "adj.", thai: "โดยรอบ, แวดล้อม", ipa: "/səˈraʊndɪŋ/", example: "Admire the historical architecture of surrounding facades." },
  { word: "architecture", pos: "noun", thai: "สถาปัตยกรรม, โครงสร้างอาคาร", ipa: "/ˈɑːkɪtektʃə/", example: "Gothic architecture distinguishes the ancient campus." },
  { word: "district", pos: "noun", thai: "ย่าน, เขต, อำเภอ", ipa: "/ˈdɪstrɪkt/", example: "The downtown business district hosts modern offices." },
  { word: "distance", pos: "noun", thai: "ระยะทาง, ที่ไกลลิบ (in the distance)", ipa: "/ˈdɪstəns/", example: "Snow-capped peaks are visible in the far distance." },
  { word: "customer", pos: "noun", thai: "ลูกค้า", ipa: "/ˈkʌstəmə/", example: "The store values long-standing, loyal customers." },
  { word: "delighted", pos: "adj.", thai: "ยินดีเป็นอย่างยิ่ง, ปลื้มใจ", ipa: "/dɪˈlaɪtɪd/", example: "We are delighted to celebrate this milestone together." },
  { word: "inform", pos: "verb", thai: "แจ้งให้ทราบ, บอกกล่าว", ipa: "/ɪnˈfɔːm/", example: "The registrar will inform you regarding schedule changes." },
  { word: "upcoming", pos: "adj.", thai: "ที่กำลังจะมาถึงในเร็วๆ นี้", ipa: "/ˈʌpkʌmɪŋ/", example: "Prepare well for your upcoming afternoon examination." },
  { word: "celebration", pos: "noun", thai: "การเฉลิมฉลอง, งานฉลอง", ipa: "/ˌselɪˈbreɪʃn/", example: "The anniversary celebration drew hundreds of patrons." },
  { word: "reduce", pos: "verb", thai: "ลดลง, ปรับลด", ipa: "/rɪˈdjuːs/", example: "Chocolates are reduced by forty percent this week." },
  { word: "annual", pos: "adj.", thai: "ประจำปี, ปีละครั้ง", ipa: "/ˈænjuəl/", example: "The annual research symposium convenes every October." },
  { word: "tradition", pos: "noun", thai: "ประเพณี, ธรรมเนียมปฏิบัติ", ipa: "/trəˈdɪʃn/", example: "The lucky raffle is a time-honored annual tradition." },
  { word: "grand", pos: "adj.", thai: "ยิ่งใหญ่, รางวัลใหญ่ (grand prize)", ipa: "/ɡrænd/", example: "The grand prize includes a three-night tropical vacation." },
  { word: "stay", pos: "noun/verb", thai: "การพักแรม, พักอาศัย", ipa: "/steɪ/", example: "Enjoy a complimentary resort stay on Phuket island." },
  { word: "island", pos: "noun", thai: "เกาะ", ipa: "/ˈaɪlənd/", example: "Phuket island is celebrated for crystalline ocean bays." },
  { word: "winner", pos: "noun", thai: "ผู้ชนะ, ผู้โชคดี", ipa: "/ˈwɪnə/", example: "The lucky draw winner will be announced publicly." },
  { word: "guided", adj: "adj.", thai: "ที่มีไกด์นำเที่ยว", ipa: "/ˈɡaɪdɪd/", example: "Tourists booked an educational guided island tour." },
  { word: "ticket", pos: "noun", thai: "ตั๋ว, บัตรชิงโชค", ipa: "/ˈtɪkɪt/", example: "Buy a fifteen-dollar raffle ticket for charity." },
  { word: "donate", pos: "verb", thai: "บริจาค", ipa: "/dəʊˈneɪt/", example: "All proceeds are donated to children's orphanages." },
  { word: "available", pos: "adj.", thai: "มีจำหน่าย, มีพร้อมใช้", ipa: "/əˈveɪləbl/", example: "Official tickets are available on the corporate portal." },
  { word: "welcoming", pos: "adj.", thai: "ที่ให้การต้อนรับอย่างอบอุ่น", ipa: "/ˈwelkəmɪŋ/", example: "Staff create a welcoming environment for attendees." },
  { word: "occasion", pos: "noun", thai: "โอกาสพิเศษ, วาระสำคัญ", ipa: "/əˈkeɪʒn/", example: "A golden anniversary is an extraordinary milestone occasion." },
  { word: "director", pos: "noun", thai: "ผู้อำนวยการ, ผู้บริหาร", ipa: "/daɪˈrektə/", example: "The marketing director drafted the anniversary announcement." },
  { word: "introduce", pos: "verb", thai: "แนะนำ, เปิดตัว", ipa: "/ˌɪntrəˈdjuːs/", example: "The company aims to introduce wholesome organic snacks." },
  { word: "employee", pos: "noun", thai: "พนักงาน, ลูกจ้าง", ipa: "/ɪmˈplɔɪiː/", example: "Dedicated employees receive merit-based wage bonuses." },
  { word: "contact", pos: "verb/noun", thai: "ติดต่อ, สื่อสาร", ipa: "/ˈkɒntækt/", example: "Contact academic advising if you encounter schedule conflicts." },
  { word: "mall", pos: "noun", thai: "ห้างสรรพสินค้า", ipa: "/mɔːl/", example: "Local shopping malls feature regional food courts." },
  { word: "literature", pos: "noun", thai: "วรรณคดี, งานประพันธ์", ipa: "/ˈlɪtrətʃə/", example: "Professor Stanton lectures on Renaissance English literature." },
  { word: "assistant", pos: "noun", thai: "ผู้ช่วย (เช่น Teaching Assistant: TA)", ipa: "/əˈsɪstənt/", example: "Teaching assistants conduct weekly discussion recitations." },
  { word: "switch", pos: "verb", thai: "เปลี่ยน, สลับ (switch major)", ipa: "/swɪtʃ/", example: "She switched her primary major from history to physics." },
  { word: "overwhelm", pos: "verb", thai: "ทำให้รู้สึกหนักอึ้ง, รับมือไม่ไหว", ipa: "/ˌəʊvəˈwelm/", example: "Avoid overload so exam pressures do not overwhelm you." },
  { word: "primary", pos: "adj.", thai: "ที่เป็นหลัก, สำคัญที่สุด", ipa: "/ˈpraɪməri/", example: "Her primary objective is completing her honors thesis." },
  { word: "purpose", pos: "noun", thai: "วัตถุประสงค์, เป้าหมาย", ipa: "/ˈpɜːpəs/", example: "State clearly the purpose of your academic inquiry." },
  { word: "essay", pos: "noun", thai: "เรียงความ, บทความวิชาการ", ipa: "/ˈeseɪ/", example: "Submit your midterm Shakespeare analytical essay on time." },
  { word: "advice", pos: "noun", thai: "คำแนะนำ, ข้อคิดเห็น", ipa: "/ədˈvaɪs/", example: "Listen closely to constructive advice from your advisor." },
  { word: "appeal", pos: "verb/noun", thai: "อุทธรณ์, ร้องเรียนขอพิจารณาใหม่", ipa: "/əˈpiːl/", example: "Students may appeal grading decisions within seven days." },
  { word: "initially", pos: "adv.", thai: "ในตอนแรก, แต่เดิม", ipa: "/ɪˈnɪʃəli/", example: "John initially assumed she was a first-year student." },
  { word: "assume", pos: "verb", thai: "สันนิษฐาน, เข้าใจไปเอง", ipa: "/əˈsjuːm/", example: "Do not assume course prerequisites without verifying." },
  { word: "unfamiliar", pos: "adj.", thai: "ไม่คุ้นเคย, แปลกหน้า", ipa: "/ˌʌnfəˈmɪliə/", example: "New exchange students feel unfamiliar with campus paths." },
  { word: "layout", pos: "noun", thai: "แผนผัง, โครงสร้างการจัดวาง", ipa: "/ˈleɪaʊt/", example: "The campus map illustrates building and roadway layout." },
  { word: "normally", pos: "adv.", thai: "โดยปกติ, ตามธรรมดา", ipa: "/ˈnɔːməli/", example: "Introductory survey courses are normally taken in year one." },
  { word: "identity", pos: "noun", thai: "บัตรประจำตัว (identity card / ID)", ipa: "/aɪˈdentəti/", example: "Show your valid student identity card at the library desk." },
  { word: "graduate", pos: "verb/noun", thai: "สำเร็จการศึกษา, ผู้สำเร็จการศึกษา", ipa: "/ˈɡrædʒuət/", example: "She graduated top of her physical sciences cohort." },
  { word: "practical", pos: "adj.", thai: "ในทางปฏิบัติ, นำไปใช้ได้จริง", ipa: "/ˈpræktɪkl/", example: "Advisors offer practical strategies for course balance." },
  { word: "regarding", pos: "prep.", thai: "เกี่ยวกับ, ในเรื่อง", ipa: "/rɪˈɡɑːdɪŋ/", example: "Ask any questions regarding graduation deadlines." },
  { word: "intensive", pos: "adj.", thai: "เข้มข้น, เจาะลึก", ipa: "/ɪnˈtensɪv/", example: "Shakespeare seminars demand intensive weekly readings." },
  { word: "hire", pos: "verb", thai: "จ้าง, ว่าจ้าง", ipa: "/ˈhaɪə/", example: "Students sometimes hire peer tutors for calculus review." },
  { word: "tutor", pos: "noun/verb", thai: "ครูสอนพิเศษ, ติวเตอร์", ipa: "/ˈtjuːtə/", example: "A mathematics tutor helped clarify abstract proofs." },
  { word: "drop", pos: "verb", thai: "ถอนวิชา, ดรอปเรียน", ipa: "/drɒp/", example: "Drop the seminar before the census deadline to avoid a penalty." },
  { word: "automatic", pos: "adj.", thai: "อัตโนมัติ", ipa: "/ˌɔːtəˈmætɪk/", example: "No student receives an automatic passing semester mark." },
  { word: "passing", pos: "adj.", thai: "ผ่านเกณฑ์ (passing grade)", ipa: "/ˈpɑːsɪŋ/", example: "Maintain a passing GPA to sustain full scholarship rights." },
  { word: "protect", pos: "verb", thai: "ปกป้อง, ป้องกันรักษา", ipa: "/prəˈtekt/", example: "Limit your job hours in order to protect your GPA." },
  { word: "poverty", pos: "noun", thai: "ความยากจน, ความอัตคัด", ipa: "/ˈpɒvəti/", example: "She persevered despite living in extreme poverty." },
  { word: "doubt", pos: "noun/verb", thai: "ความสงสัย, ลังเลใจ", ipa: "/daʊt/", example: "There is no doubt about her groundbreaking genius." },
  { word: "institution", pos: "noun", thai: "สถาบัน (เช่น สถาบันอุดมศึกษา)", ipa: "/ˌɪnstɪˈtjuːʃn/", example: "Prestigious research institutions foster innovative discoveries." },
  { word: "bread", pos: "noun", thai: "ขนมปัง", ipa: "/bred/", example: "She survived on a simple diet of bread, butter, and tea." },
  { word: "butter", pos: "noun", thai: "เนย", ipa: "/ˈbʌtə/", example: "A simple diet of bread and butter kept her going." },
  { word: "tea", pos: "noun", thai: "ชา, น้ำชา", ipa: "/tiː/", example: "She drank hot tea while studying into late nights." },
  { word: "condition", pos: "noun", thai: "สภาพความเป็นอยู่, สภาวะ, เงื่อนไข", ipa: "/kənˈdɪʃn/", example: "Despite difficult living conditions, she excelled." },
  { word: "mathematics", pos: "noun", thai: "คณิตศาสตร์", ipa: "/ˌmæθəˈmætɪks/", example: "She placed second in the mathematical sciences examination." },
  { word: "result", pos: "noun", thai: "ผลลัพธ์, คะแนนสอบ", ipa: "/rɪˈzʌlt/", example: "She achieved the highest result in the physical sciences." },
  { word: "lazy", pos: "adj.", thai: "เกียจคร้าน, ขี้เกียจ", ipa: "/ˈleɪzi/", example: "A lazy attitude prevents students from mastering new skills." },
  { word: "careless", pos: "adj.", thai: "ประมาท, สะเพร่า", ipa: "/ˈkeələs/", example: "Avoid careless errors by double-checking all answers." },
  { word: "uninterested", pos: "adj.", thai: "ไม่สนใจ, ไร้ความสนใจ", ipa: "/ʌnˈɪntrəstɪd/", example: "She was never uninterested in higher academic pursuits." }
];

// Helper to normalize strings for indexing
export function normalizeWord(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/^[“"‘'(\[{]+|[”"’')\]}.,;:!?]+$/g, '')
    .trim();
}

// Build internal master dictionary map
const dictionaryMap = new Map();

// 1. Populate from vocabData.js
vocabData.forEach(item => {
  const norm = normalizeWord(item.word);
  if (norm) {
    dictionaryMap.set(norm, {
      word: item.word,
      pos: item.pos || 'vocab',
      thai: item.thai,
      ipa: item.ipa || '',
      example: item.example || '',
      tip: item.tip || `คำศัพท์ประจำ ${item.unit || 'บทเรียน'}`,
      unit: item.unit
    });
  }

  // Also index individual key words if it's a multi-word phrase
  const parts = item.word.split(/[\s/()]+/);
  if (parts.length > 1) {
    parts.forEach(part => {
      const pNorm = normalizeWord(part);
      if (pNorm && pNorm.length > 3 && !dictionaryMap.has(pNorm)) {
        dictionaryMap.set(pNorm, {
          word: part,
          pos: item.pos || 'vocab',
          thai: `${item.thai} (จากวลี: ${item.word})`,
          ipa: '',
          example: item.example,
          unit: item.unit
        });
      }
    });
  }
});

// 2. Populate from examVocabList
examVocabList.forEach(item => {
  const norm = normalizeWord(item.word);
  if (norm) {
    dictionaryMap.set(norm, {
      ...item,
      tip: item.tip || 'คำศัพท์สำคัญในการสอบ Test 2 & Final Exam'
    });
  }
});

// Cache for live dynamic translation API
const liveTranslationCache = new Map();

/**
 * Main Lookup function
 * Resolves exact words, plurals, past tense, gerunds, and academic derivations
 */
export function lookupWord(rawWord) {
  if (!rawWord) return null;
  const word = normalizeWord(rawWord);
  if (!word || word.length < 2) return null;

  // 1. Direct match
  if (dictionaryMap.has(word)) {
    return dictionaryMap.get(word);
  }

  // 2. Irregular Past & Participle mapping
  const irregulars = {
    'was': 'be', 'were': 'be', 'been': 'be', 'became': 'become', 'began': 'begin',
    'broke': 'break', 'brought': 'bring', 'built': 'build', 'bought': 'buy',
    'chose': 'choose', 'came': 'come', 'did': 'do', 'drew': 'draw', 'drank': 'drink',
    'drove': 'drive', 'ate': 'eat', 'fell': 'fall', 'felt': 'feel', 'fought': 'fight',
    'found': 'find', 'flew': 'fly', 'forgot': 'forget', 'forgave': 'forgive',
    'froze': 'freeze', 'got': 'get', 'gave': 'give', 'went': 'go', 'grew': 'grow',
    'had': 'have', 'heard': 'hear', 'hid': 'hide', 'held': 'hold', 'kept': 'keep',
    'knew': 'know', 'laid': 'lay', 'led': 'lead', 'left': 'leave', 'lent': 'lend',
    'lost': 'lose', 'made': 'make', 'meant': 'mean', 'met': 'meet', 'paid': 'pay',
    'put': 'put', 'read': 'read', 'rode': 'ride', 'rang': 'ring', 'rose': 'rise',
    'ran': 'run', 'said': 'say', 'saw': 'see', 'sold': 'sell', 'sent': 'send',
    'set': 'set', 'shook': 'shake', 'shone': 'shine', 'shot': 'shoot', 'showed': 'show',
    'shown': 'show', 'shut': 'shut', 'sang': 'sing', 'sat': 'sit', 'slept': 'sleep',
    'spoke': 'speak', 'spent': 'spend', 'stood': 'stand', 'stole': 'steal', 'swam': 'swim',
    'took': 'take', 'taught': 'teach', 'tore': 'tear', 'told': 'tell', 'thought': 'think',
    'threw': 'throw', 'understood': 'understand', 'wore': 'wear', 'won': 'win', 'wrote': 'write'
  };

  if (irregulars[word] && dictionaryMap.has(irregulars[word])) {
    const root = dictionaryMap.get(irregulars[word]);
    return {
      ...root,
      word: `${rawWord} (รูปอดีตของ ${root.word})`,
      thai: `${root.thai} [รูป V.2 / V.3]`
    };
  }

  // 3. Suffix Stripping / Morphological Root Lookup
  const derivations = [];

  // Plurals: -ies -> -y (e.g. charities -> charity, difficulties -> difficulty)
  if (word.endsWith('ies') && word.length > 4) {
    derivations.push(word.slice(0, -3) + 'y');
  }
  // Plurals: -es (e.g. classes -> class, boxes -> box)
  if (word.endsWith('es') && word.length > 3) {
    derivations.push(word.slice(0, -2));
  }
  // Plurals: -s (e.g. savings -> saving, cyclists -> cyclist, investments -> investment)
  if (word.endsWith('s') && word.length > 3) {
    derivations.push(word.slice(0, -1));
  }
  // Past tense: -ied -> -y (e.g. studied -> study, applied -> apply)
  if (word.endsWith('ied') && word.length > 4) {
    derivations.push(word.slice(0, -3) + 'y');
  }
  // Past tense: -ed (e.g. performed -> perform, achieved -> achieve, devoted -> devote)
  if (word.endsWith('ed') && word.length > 4) {
    derivations.push(word.slice(0, -2));
    derivations.push(word.slice(0, -1)); // for words ending in -e like achieved -> achieve
  }
  // Gerund / Participle: -ing (e.g. discovering -> discover, sharing -> share, cycling -> cycle)
  if (word.endsWith('ing') && word.length > 4) {
    derivations.push(word.slice(0, -3));
    derivations.push(word.slice(0, -3) + 'e'); // e.g. sharing -> share
  }
  // Adverbs: -ly (e.g. exceptionally -> exceptional, rarely -> rare)
  if (word.endsWith('ly') && word.length > 4) {
    derivations.push(word.slice(0, -2));
  }
  // Comparatives: -er / -est (e.g. higher -> high, highest -> high)
  if (word.endsWith('est') && word.length > 4) {
    derivations.push(word.slice(0, -3));
  }
  if (word.endsWith('er') && word.length > 3) {
    derivations.push(word.slice(0, -2));
  }

  for (const rootWord of derivations) {
    if (dictionaryMap.has(rootWord)) {
      const match = dictionaryMap.get(rootWord);
      return {
        ...match,
        word: `${rawWord} (รูปย่อยของ ${match.word})`,
        thai: `${match.thai}`
      };
    }
  }

  // 4. Check cached live translation
  if (liveTranslationCache.has(word)) {
    return liveTranslationCache.get(word);
  }

  return null;
}

/**
 * Fetch dynamic online translation if missing from static dictionary
 * Uses free MyMemory translation API with timeout and fallback
 */
export async function fetchLiveTranslation(query) {
  const norm = normalizeWord(query);
  if (!norm) return null;

  if (liveTranslationCache.has(norm)) {
    return liveTranslationCache.get(norm);
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(query)}&langpair=en|th`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.responseData && data.responseData.translatedText) {
        const thaiText = data.responseData.translatedText;
        // Check if translation is valid and not just echoing identical English
        if (thaiText && thaiText.toLowerCase() !== query.toLowerCase()) {
          const result = {
            word: query,
            pos: 'general',
            thai: thaiText,
            ipa: '',
            example: `คำศัพท์ในข้อสอบ: "${query}"`,
            tip: 'แปลความหมายด้วยระบบแปลภาษาอัตโนมัติ (Live Translation)'
          };
          liveTranslationCache.set(norm, result);
          return result;
        }
      }
    }
  } catch (err) {
    // Network unavailable or offline - return soft fallback
  }

  // Fallback card
  const fallback = {
    word: query,
    pos: 'term',
    thai: `[คำศัพท์: ${query}] กดฟังเสียงอ่านเพื่อฝึกออกเสียง`,
    ipa: '',
    example: '',
    tip: 'สามารถใช้ร่วมกับบริบทในประโยคและตัวช่วยแปลทั้งช้อยส์'
  };
  liveTranslationCache.set(norm, fallback);
  return fallback;
}
