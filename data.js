
document.getElementById('profileImg').src = './ali.jpg';

function toggleProfile() {
  document.getElementById('profilePopover').classList.toggle('open');
}
document.addEventListener('click', function(e) {
  var corner = document.querySelector('.profile-corner');
  var pop = document.getElementById('profilePopover');
  if (corner && !corner.contains(e.target)) {
    pop.classList.remove('open');
  }
});

// ─── HOW TO ADD PDF FILES ───
// 1) On GitHub, create folders following this pattern:
//    files/<yearKey>/<termKey>/<subject-slug>/<resourceKey>/yourfile.pdf
//    Example: files/y2/term1/adult-health-nursing-1/lectures/lecture1.pdf
// 2) Upload your PDF inside the right folder.
// 3) Add an entry to that subject's "files" object below, e.g.:
//    files: { lectures: [ { title: 'Lecture 1 - Intro', file: 'lecture1.pdf' } ], summaries: [], flashcards: [], mcq: [] }
// The "file" value must exactly match the uploaded PDF filename.
// Resource keys are always: lectures, summaries, flashcards, mcq

const years = {
  y1: {
    title: 'First Year',
    badge: 'Year 01',
    badgeStyle: 'background:rgba(29,158,117,0.18);color:#0F6E56;',
    desc: 'Foundations of nursing — anatomy, physiology, and basic sciences',
    color: 'rgba(29,158,117,0.18)',
    terms: {
      term1: [
        { name: 'Fundamental Nursing 1 (Practice)', slug: 'fundamental-nursing-1-practice', desc: 'Practical sessions for fundamental nursing skills', icon: '🩹', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'Health Assessment (Laboratory)', slug: 'health-assessment-laboratory', desc: 'Practical health assessment skills lab', icon: '🩺', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'Anatomy - Laboratory', slug: 'anatomy-laboratory', desc: 'Practical anatomy lab sessions', icon: '🦴', files: { lectures: [
            { title: 'Anatomical Terms, Fascia & Cartilage', file: 'Anatomical term, fascia, cartilage.pdf' },
            { title: 'Joints & Muscular System', file: 'Joints, muscular system.pdf' },
            { title: 'Practical Exam', file: 'Practicle exam.pdf' },
          ], summaries: [], flashcards: [], mcq: [] } },
        { name: 'Anatomy - Theory', slug: 'anatomy-theory', desc: 'Theoretical foundations of human anatomy', icon: '🧠', files: { lectures: [
            { title: 'Digestive System', file: 'DIGESTIVE SYSTEM.pdf' },
            { title: 'Endocrine & Lymphatic Systems', file: 'Endocrine, lymphatic systems.pdf' },
            { title: 'Gastrointestinal System', file: 'Gastrointestinal system.pdf' },
            { title: 'Genital System', file: 'Genital system.pdf' },
            { title: 'Nervous System', file: 'Nervous system.pdf' },
            { title: 'Respiratory System', file: 'Respiratory system.pdf' },
            { title: 'Urinary System', file: 'Urinary system.pdf' },
          ], summaries: [], flashcards: [], mcq: [
            { title: 'بنك أسئلة أناتومي نظري', file: 'بنك اسئله اناتومي نظري.pdf' },
          ] } },
        { name: 'Physiology', slug: 'physiology', desc: 'Foundations of human body function', icon: '🫁', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'Fundamental Nursing 1 (Theory)', slug: 'fundamental-nursing-1-theory', desc: 'Core theoretical concepts of fundamental nursing', icon: '📘', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'Health Assessment (Theory)', slug: 'health-assessment-theory', desc: 'Theoretical foundations of health assessment', icon: '📋', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'Professional Ethics and Legislation', slug: 'professional-ethics-and-legislation', desc: 'Nursing ethics, laws, and professional conduct', icon: '⚖️', files: { lectures: [
            { title: 'Introduction of Ethics', file: 'Introduction of Ethics.pdf' },
            { title: 'Ethical Principles - Part 1', file: '3- Ethical Principles - part1.pdf' },
            { title: 'Ethical Principles - Part 2', file: '4-Ethical Principles part 2.pdf' },
            { title: 'Values in Nursing and Professional Ethics', file: '5-Values in Nursing and Professional Ethics16-10.pdf' },
            { title: 'Code of Ethics', file: '6-Code of ethics.pdf' },
            { title: 'Patient Rights & Responsibilities', file: '7-Patient rights  responsabilities.pdf' },
            { title: 'Nurses Rights and Responsibilities', file: '8-Nurses rights and responsibilities.pdf' },
            { title: 'Ethical and Professional Conduct for Nursing Students', file: '9-Ethical and professional conduct for nursing students.pdf' },
            { title: 'Ethics Course', file: 'ethics course.pdf' },
            { title: 'Ethics Book - Al Ryada', file: 'Ethics book Al Ryada.pdf' },
          ], summaries: [], flashcards: [], mcq: [
            { title: 'Ethics Question Bank', file: 'questions ethics.pdf' },
          ] } },
        { name: 'Medical Terminology', slug: 'medical-terminology', desc: 'Terminology used in medical and nursing practice', icon: '🔤', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'English', slug: 'english-1', desc: 'English language skills for nursing students', icon: '🗣️', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'Information Technology', slug: 'information-technology', desc: 'Basic computing and IT skills', icon: '💻', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
      ],
      term2: [
        { name: 'Fundamental Nursing 2 (Practical)', slug: 'fundamental-nursing-2-practical', desc: 'Practical sessions for fundamental nursing skills', icon: '🩹', files: { lectures: [
            { title: 'Fundamental Nursing 2 - Book', file: 'Funda 2 book.pdf' },
            { title: 'Fundamental Nursing 2 - Checklist', file: 'funda2 Checklist.pdf' },
            { title: 'توصيف فاندا 2 عملي', file: 'توصيف فاندا 2 عملي.pdf' },
          ], summaries: [], flashcards: [], mcq: [] } },
        { name: 'Microbiology and Infection Control', slug: 'microbiology-and-infection-control', desc: 'Microorganisms and infection prevention principles', icon: '🦠', files: { lectures: [
            { title: 'Lecture 1 - Introduction', file: 'Lec.1 Intorduction.pdf' },
            { title: 'Lecture 1 - Introduction to Microbiology and Infection Control', file: 'lec.1 Introduction to microbiology and infection control.pdf' },
            { title: 'Lecture 2 - Bacterial Morphology', file: 'Lec.2 Bacterial morphology.pdf' },
            { title: 'Lecture 3 - Bacterial Physiology', file: 'Lec.3 Bacterial physiology.pdf' },
            { title: 'Lecture 4 - Normal Flora & Opportunistic Infections', file: 'Lec.4 Normal-Flora opportunistic infections (1).pdf' },
            { title: 'Lecture 5 - Sterilization', file: 'Lecture-5-Sterilization (1).pdf' },
            { title: 'Lecture 6 - Antimicrobial Chemotherapy', file: 'lec.6 antimicrobial chemotherapy (1).pdf' },
            { title: 'Lecture 7 - Antimicrobial Resistance', file: 'lec 7 antimicrobial resistance (1).pdf' },
            { title: 'Lecture 8 - Bacterial Infections & Lab Diagnosis', file: 'lec.8 Bacterial infections and lab diagnosis (1).pdf' },
            { title: 'Lecture 9 - Fungi and Fungal Infections', file: 'lec 9 fungi and fungal infections (1).pdf' },
            { title: 'Lecture 10 - Viruses and Viral Infections', file: 'LEC 10 viruses and viral infections (1).pdf' },
            { title: 'Lecture 11 - Health Care Associated Infections', file: 'lec 11. Health care associated infections (1).pdf' },
            { title: 'Interactive Book - RST', file: 'interactive book RST.pdf' },
          ], summaries: [], flashcards: [], mcq: [
            { title: 'Question Bank 1', file: 'qbank.pdf' },
            { title: 'Question Bank 2', file: 'QBank2.pdf' },
          ] } },
        { name: 'Biochemistry and Nutrition', slug: 'biochemistry-and-nutrition', desc: 'Biochemical processes and nutritional science', icon: '🧪', files: { lectures: [
            { title: 'Lecture 1 - Eukaryotic Cells, ECF and Water Balance (Part 1)', file: 'Lecture 1_Eukaryotic_cells_,_ECF_and_water_balance_Part_one_without.pdf' },
            { title: 'Lecture 3 - CHO Chemistry', file: 'Lecture 3 CHO chemistry.pdf' },
            { title: 'Lecture 4 - Lipid Chemistry', file: 'Lecture 4  lipid chemistry.pdf' },
            { title: 'Lecture 5 - Biochemistry of Protein, Structure & Function', file: 'Lecture 5 Biochemistry of protein, structure function.pdf' },
            { title: 'Lecture 6 - Vitamins & Minerals', file: 'Lecture 6_vitamins_minerals (7).pdf' },
            { title: 'Lecture 6 - Vitamins & Minerals (نسخة محدثة)', file: 'Lecture 6_vitamins_minerals (7) (1).pdf' },
            { title: 'Lecture 7 - pH, Buffers, Acidosis, Alkalosis', file: 'Lecture 7 pH , Buffers, Acidosis, alkalosis.pdf' },
            { title: 'Lecture 9 - Obesity', file: 'Lecture 9. Obesity.pdf' },
            { title: 'Lecture 10 - Nursing', file: 'lecture 10, nursing.pdf' },
            { title: 'Lecture 11 - Diabetes', file: 'Lecture 11. diabetes.pdf' },
          ], summaries: [
            { title: 'Applied Biochemical Nursing Session', file: 'Applied Biochemical NURSING Session.pdf' },
            { title: 'Lecture 1 - Eukaryotic Cells, ECF and Water Balance', file: 'Lecture 1 Eukaryotic cells , ECF and water balance.pdf' },
            { title: 'Lecture 2 - pH, Buffers, Acidosis, Alkalosis', file: 'Lecture 2 pH , Buffers, Acidosis, alkalosis.pdf' },
            { title: 'Lipid Chemistry Lecture - Mohamed Rizk', file: 'Mohamed Rizk lipid chemistry lecture.pdf' },
            { title: 'Lecture 5 - Biochemistry of Amino Acids and Protein Structure Function', file: 'RST Lecture 5 Biochemistry of amino acids and protein structure function (1).pdf' },
            { title: 'Carbohydrate', file: 'carbohydrate.pdf' },
            { title: 'Summarized Lecture About Nutrition', file: 'summarized lecture about nutrition.pdf' },
          ], flashcards: [], mcq: [
            { title: 'Case Study Bank', file: 'Case study Bank.pdf' },
            { title: 'Final Question Bank', file: 'Final question bank.pdf' },
            { title: 'Common Bank of MCQs and Essay Questions', file: 'common bank of MCQs and assay question (1).pdf' },
            { title: 'Question Bank - Buffers, Vitamins, Minerals, Obesity', file: 'question bank for buffers, vitamins, minerals,obesity.pdf' },
            { title: 'Question Bank for Nursing', file: 'question bank for nursing.pdf' },
            { title: 'مقالي بنك الأسئلة', file: 'مقالي بنك الاسئله.pdf' },
          ] } },
        { name: 'Fundamental Nursing 2 (Theory)', slug: 'fundamental-nursing-2-theory', desc: 'Core theoretical concepts of fundamental nursing', icon: '📘', files: { lectures: [
            { title: 'Fecal & Urinary Elimination', file: 'Fecal  Urinary elimination.pdf' },
            { title: 'Fluid, Electrolyte and Acid-Base Balance', file: 'Fluid, Electrolyte and acid- base balance.pdf' },
            { title: 'Loss, Grief and Death', file: 'Loss, Grief and Death.pdf' },
            { title: 'Medications Administration', file: 'Medications administration.pdf' },
            { title: 'Nursing Process Assignment for Student', file: 'Nursing Process Assignment for student.pdf' },
            { title: 'Nursing Process', file: 'Nursing process.pdf' },
            { title: 'Nutrition', file: 'Nutrition.pdf' },
            { title: 'Oxygenation', file: 'Oxygenation.pdf' },
            { title: 'Sleep - Part 2', file: 'Sleep2.pdf' },
            { title: 'Fundamental Nursing 2 (Theory) - Book', file: 'book fundamintal two theory.pdf' },
            { title: 'Sleep - Part 1', file: 'lecture Sleep1 .pdf' },
            { title: 'Pain', file: 'pain.pdf' },
            { title: 'Stress', file: 'stress.pdf' },
          ], summaries: [
            { title: 'Fecal Elimination', file: 'Fecal Elimination.pdf' },
            { title: 'Fluid, Electrolyte, and Acid Base Balance', file: 'Fluid, electrolyte, and acid base balance.pdf' },
            { title: 'Medications Administration', file: 'Medications administration2.pdf' },
            { title: 'Nursing Process', file: 'Nursing process.pdf' },
            { title: 'Nutrition', file: 'Nutrition22.pdf' },
            { title: 'Sleep', file: 'Sleep[1].pdf' },
            { title: 'Loss, Death, and Grief', file: 'loss, death, and grief lecture.pdf' },
            { title: 'Self Concept', file: 'self concept.pdf' },
            { title: 'Stress', file: 'stress.pdf' },
          ], flashcards: [], mcq: [
            { title: 'Final Question Bank - Fundamental Nursing 2', file: 'Final Questions bank Funda II.pdf' },
            { title: 'Question Bank - Fundamental Nursing 2 (Theory)', file: 'question bank funda II theory.pdf' },
            { title: 'Question Bank - Fundamental Nursing 2', file: 'question bank funda2.pdf' },
          ] } },
        { name: 'Holistic Nursing Care', slug: 'holistic-nursing-care', desc: 'Comprehensive, patient-centered approach to care', icon: '🌿', files: { lectures: [
            { title: 'Final Holistic Care - Book', file: 'Final Holistic Care book.pdf' },
            { title: 'Lecture 1 - Holistic Care', file: 'Lecture 1 Holistic care (1).pdf' },
            { title: 'Lecture 2 - Holistic Care', file: 'Lecture 2 Holistic care.pdf' },
            { title: 'Lecture 3 - Holistic Care', file: 'Lecture 3 Holistic care.pdf' },
            { title: 'Lecture 4 - Holistic Care', file: 'Lecture 4 Holistic care (1).pdf' },
            { title: 'Lecture 5 - Holistic Care', file: 'Lecture 5 Holistic care (1).pdf' },
            { title: 'Lecture 6 - Holistic Care', file: 'Lecture 6 Holistic care.pdf' },
            { title: 'Lecture 7 - Holistic Care', file: 'Lecture 7 Holistic care.pdf' },
            { title: 'Lecture 8 - Holistic Care', file: 'Lecture 8 Holistic care.pdf' },
            { title: 'Lecture 9 - Holistic Care', file: 'Lecture 9 Holistic care.pdf' },
          ], summaries: [], flashcards: [
            { title: 'تعريفات', file: 'تعريفات .pdf' },
            { title: 'مقالي على المحاضرات كلها', file: 'مقالي على المحاضرات كلها.pdf' },
          ], mcq: [] } },
        { name: 'Basics of Quality and Safety in Health Care', slug: 'basics-of-quality-and-safety-in-health-care', desc: 'Foundations of healthcare quality and patient safety', icon: '✅', files: { lectures: [
            { title: 'Effective Communication for Risk Management & Quality Improvement', file: 'Effective Communication for Risk Management  Quality Improvement (1).pdf' },
            { title: 'Evidence Based Practice for Risk Management & Quality Improvement', file: 'Evidence Based Practice for Risk Management  Quality Improvement.pdf' },
            { title: 'Quality & Safety - Book', file: 'Quality  safety Book.pdf' },
            { title: 'Continuous Quality Improvement', file: 'continous quality improvrment.pdf' },
            { title: 'Introduction to Quality', file: 'intoduction to quality.pdf' },
            { title: 'Leadership for Effective Risk Management', file: 'leadership for effective risk management (1).pdf' },
            { title: 'Nursing Informatics for Quality Improvement', file: 'nursing informatics for quality improvement.pdf' },
            { title: 'Risk Management', file: 'risk management.pdf' },
          ], summaries: [], flashcards: [], mcq: [
            { title: 'Question Bank', file: 'question bank.pdf' },
          ] } },
        { name: 'Communication Skill in Nursing', slug: 'communication-skill-in-nursing', desc: 'Therapeutic communication and interpersonal skills', icon: '🗨️', files: { lectures: [
            { title: 'Lecture 1', file: 'lecture 1.pdf' },
            { title: 'Lecture 2', file: 'communication ( lecture 2 ).pdf' },
            { title: 'Lecture 3', file: 'communication (lecture 3) (1).pdf' },
            { title: 'Lecture 4', file: 'communication skills (lecture 4).pdf' },
            { title: 'Lecture 5', file: 'lecture 5 (1).pdf' },
            { title: 'Lecture 6', file: 'communication (lecture 6 (1).pdf' },
            { title: 'Lecture 7', file: 'communication ( lecture 7 ).pdf' },
            { title: 'Lecture 7 (نسخة)', file: 'communication (lecture 7).pdf' },
            { title: 'Communication Skills - Course Specification', file: 'communication skills course specisification.pdf' },
            { title: 'Communication Skills - Book', file: 'communication_skills Book.pdf' },
          ], summaries: [], flashcards: [], mcq: [
            { title: 'Question Bank - Lecture One', file: 'Questions bank (communication, lecture one ).pdf' },
            { title: 'Question Bank - Lecture Two', file: 'Questions bank (communication, lecture two) (1).pdf' },
            { title: 'Question Bank - Lecture Three', file: 'Questions bank (communication, lecture three (1).pdf' },
            { title: 'Question Bank - Lecture Four', file: 'Questions bank (communication, lecture four  ).pdf' },
            { title: 'Question Bank - Lecture Five', file: 'Questions bank (communication, lecture five).pdf' },
            { title: 'Question Bank - Lecture Five (نسخة)', file: 'Questions bank (communication, lecture five) (1).pdf' },
            { title: 'Question Bank - Lecture Six', file: 'Questions bank (communication, lecture six).pdf' },
            { title: 'Question Bank - Lecture Seven', file: 'Questions bank (communication, lecture seven).pdf' },
          ] } },
        { name: 'English (1)', slug: 'english-2', desc: 'English language skills for nursing students', icon: '🗣️', files: { lectures: [
            { title: 'Case Studies', file: 'Case Studie_s (1).pdf' },
            { title: 'Cohesive Devices in Academic Writing', file: 'Cohesive Devices in Academic Writing (1).pdf' },
            { title: 'Example of Properties of Technical English', file: 'Example of properties of technical English.pdf' },
            { title: 'Formal vs Informal Speech', file: 'Formal_vs_Informal_Speech (1).pdf' },
            { title: 'Paraphrasing', file: 'Paraphrasing.pdf' },
            { title: 'Properties of Technical English', file: 'Properties of Technical English (1).pdf' },
            { title: 'Sentence, Fragment, Run-on Sentence', file: 'Sentence, Fragment,  Run on  Sentence (1).pdf' },
            { title: 'Types of Sentences', file: 'Types of sentences .1 (1).pdf' },
            { title: 'Common Mistakes', file: 'common mistakes (1).pdf' },
            { title: 'Present Simple', file: 'present simple .m.pdf' },
          ], summaries: [
            { title: 'Answer Key', file: 'Answer Key.pdf' },
            { title: 'Correct the Underlined Mistakes', file: 'Correct the Underlined Mistakes.pdf' },
            { title: 'Final English Language Exam', file: 'Final English Language Exam.pdf' },
            { title: 'Paraphrase', file: 'Paraphrase.pdf' },
            { title: 'Paraphrase ازاي نحل', file: 'Paraphrase ازاي نحل.pdf' },
            { title: 'ازاي نحل اسئلة النفي', file: 'ازاي نحل اسئله النفي.pdf' },
            { title: 'تدريب على النفي والتصحيح', file: 'تدريب على النفي والتصحيح .pdf' },
          ], flashcards: [], mcq: [
            { title: 'Drill 1', file: 'Drill_1 (2) (1).pdf' },
            { title: 'MCQ - Sentence, Fragment, Run-on', file: 'MCQ Sentence, Fragment , Run on (1).pdf' },
          ] } },
        { name: 'Community Issues', slug: 'community-issues', desc: 'Community health concepts and challenges', icon: '🏘️', files: { lectures: [
            { title: 'Lectures 1-2', file: 'Lec1-2.pdf' },
            { title: 'Lectures 3-4', file: 'Lec3-4.pdf' },
            { title: 'Lecture 5', file: 'Lec5.pdf' },
            { title: 'Lecture 6', file: 'Lec6.pdf' },
            { title: 'Lecture 7', file: 'lec7.pdf' },
            { title: 'Lecture 8', file: 'lec8.pdf' },
            { title: 'Lecture 9 (Complete)', file: 'lec9complet.pdf' },
            { title: 'Lecture 9', file: 'LEC9.pdf' },
            { title: 'Lecture 10', file: 'lec10.pdf' },
          ], summaries: [
            { title: 'Social Issues 1, 2', file: '🌍 Social Issues 1,2.pdf' },
            { title: 'Social Issues 3', file: '🌍 Social Issues 3.pdf' },
            { title: 'Social Issues 4', file: '🌍 Social Issues 4.pdf' },
            { title: 'Social Issues 5', file: '🌍 Social Issues 5.pdf' },
            { title: 'Social Issues 6', file: '🌍 Social Issues 6.pdf' },
            { title: 'Social Issues 7', file: '🌍 Social Issues 7.pdf' },
            { title: 'Social Issues 8', file: '🌍 Social Issues 8.pdf' },
            { title: 'Social Issues 9', file: '🌍 Social Issues 9.pdf' },
          ], flashcards: [], mcq: [] } },
        { name: 'Critical Thinking', slug: 'critical-thinking', desc: 'Clinical reasoning and critical thinking skills', icon: '🧩', files: { lectures: [
            { title: 'Lecture 1', file: '1st lecture.pdf' },
            { title: 'Lecture 2 - Critical Thinking', file: 'LEC 2 CRITICAL THINKIKNG.pdf' },
            { title: 'Lecture 3.2 - Critical Thinking', file: '3.,2 critical thinking.pdf' },
            { title: 'Critical Thinking, Reasoning and Logic', file: 'Critical Thinking, Reasoning  And Logic.pdf' },
            { title: 'Evaluating Deductive Arguments', file: 'Evaluating Deductive Arguments.pdf' },
            { title: 'Evaluating Inductive Argument', file: 'Evaluating Inductive Argument.pdf' },
            { title: 'Logic and Argument (Techniques of Recognizing Arguments)', file: 'LOGIC AND ARGUMENT (Techniques of Recognizing Arguments ).pdf' },
            { title: 'Problem Solving and Decision Making', file: 'Proplem Solving and Desicion Making.pdf' },
            { title: "Bloom's Taxonomy", file: 'blooms taxsonomy.pdf' },
            { title: 'Logic', file: 'logic.pdf' },
          ], summaries: [
            { title: 'Lecture 1', file: '1st lecture.pdf' },
            { title: 'Critical Thinking, Reasoning and Logic', file: 'Critical Thinking, Reasoning  And Logic.pdf' },
            { title: 'Evaluating Arguments', file: 'Evaluating Arguments.pdf' },
            { title: 'Part 2 - Evaluating Argument', file: 'Part 2 evaluating argument.pdf' },
            { title: "Bloom's Taxonomy", file: 'blooms taxsonomy.pdf' },
            { title: 'Problem Solving and Decision Making', file: 'proplem solving and desicion making (1).pdf' },
          ], flashcards: [], mcq: [
            { title: 'Critical Thinking and Logic - Full Quiz', file: 'Critical_Thinking_and_Logic_Full_Quiz.pdf' },
            { title: 'Inductive vs Deductive Reasoning in Nursing', file: 'Inductive_vs_Deductive_Reasoning_Nursing.pdf' },
            { title: 'Question Bank - Extended', file: 'QUESTION BANK EXTENDED.pdf' },
            { title: 'Question Bank - Lectures 1, 2', file: 'question bank lect 1,2.pdf' },
          ] } },
      ]
    }
  },
  y2: {
    title: 'Second Year',
    badge: 'Year 02',
    badgeStyle: 'background:rgba(55,138,221,0.18);color:#185FA5;',
    desc: 'Clinical nursing skills, pharmacology, and patient care essentials',
    color: 'rgba(55,138,221,0.18)',
    terms: {
      term1: [
        { name: 'Adult Health Nursing 1', slug: 'adult-health-nursing-1', desc: 'Fundamentals of adult health and medical-surgical nursing', icon: '🩺', files: { lectures: [
            { title: 'Oncology 1', file: 'oncology 1.pdf' },
            { title: 'Perioperative Care', file: 'Perioperative care.pdf' },
            { title: 'Pneumonia & TB', file: 'Pneumonia & TB.pdf' },
            { title: 'Upper Respiratory Tract Obstruction', file: 'Upper respiratory tract obstruction(1).pdf' },
            { title: 'Asthma', file: 'Asthma_251015_221704.pdf' },
            { title: 'Blood Disorder', file: 'blood disorder.pdf' },
            { title: 'Cardiovascular Dysfunction', file: 'cardiovascular dysfunction.pdf' },
            { title: 'Fluid & Electrolytes', file: 'Fluid  electrolytes.pdf' },
            { title: 'Heart Failure', file: 'Heart+Failure.pdf' },
            { title: 'Hypertension', file: 'Hypertension(1).pdf' },
            { title: 'Management of Patient with Deep Venous Thrombosis', file: 'Management of patient with Deep venous thrombosis.pdf' },
            { title: 'Management of Patients with Atherosclerosis', file: 'Management of patients with atherosclerosis.pdf' },
          ], summaries: [
            { title: 'Cardiovascular Dysfunction', file: 'cardiovascular dysfunction.pdf' },
            { title: 'Fluid & Electrolytes', file: 'Fluid  electrolytes.pdf' },
            { title: 'Heart Failure', file: 'Heart Failure.pdf' },
            { title: 'Hypertension', file: 'Hypertension(1).pdf' },
            { title: 'Management of Patient with Deep Venous Thrombosis', file: 'Management of Patient with Deep Venous Thrombosis.pdf' },
            { title: 'Management of Patients with Atherosclerosis', file: 'Management of patients with atherosclerosis.pdf' },
            { title: 'Oncology 1', file: 'oncology 1.pdf' },
            { title: 'Perioperative Care', file: 'Perioperative care.pdf' },
            { title: 'Pneumonia & TB', file: 'Pneumonia & TB.pdf' },
            { title: 'Upper Respiratory Tract Obstruction', file: 'Upper respiratory tract obstruction(1).pdf' },
            { title: 'Blood Disorder', file: 'blood disorder.pdf' },
            { title: 'Bronchial Asthma', file: 'Bronchial Asthma.pdf' },
          ], flashcards: [], mcq: [
            { title: 'Questions Bank - Dr. Bardes', file: 'questions bank dr.bardes.pdf' },
          ] } },
        { name: 'Critical Care & Emergency Nursing 1', slug: 'critical-care-emergency-nursing-1', desc: 'Introduction to critical care and emergency nursing principles', icon: '🚨', files: { lectures: [
            { title: 'Lung Injury and Chest Trauma', file: 'Lung_injury_and_chest_trauma_(1)[1].pdf' },
            { title: 'Mechanical Ventilation', file: 'Mechanical Ventilation_251220_140006.pdf' },
            { title: 'Myocardial Infarction 2', file: 'Myocardial Infarction 2.pdf' },
            { title: 'Pain Management', file: 'Pain Management_092509 (1).pdf' },
            { title: 'Pulmonary Embolism (PE)', file: 'Pulmonary Embolism (PE).pdf' },
            { title: 'Respiratory Failure', file: 'Respiratory failure (1).pdf' },
            { title: 'Shock Presentation', file: 'Shock presentation (1).pdf' },
            { title: 'Triage', file: 'Triage.pdf' },
            { title: 'Acid Base Imbalance', file: 'Acid base imbalance.pdf' },
            { title: 'Acute Respiratory Distress Syndrome', file: 'Acute_Respiratory_Distress_Syndrome[1].pdf' },
            { title: 'Cardiac Surgery', file: 'Cardiac surgery (1).pdf' },
            { title: 'Cardiac Dysrhythmia', file: 'cardiac_dysrthmia[1].pdf' },
            { title: 'Code Management', file: 'code managment power.pdf' },
            { title: 'Electrocardiogram', file: 'Electrocardiogram_051455.pdf' },
          ], summaries: [
            { title: 'Electrocardiogram', file: 'Electrocardiogram.pdf' },
            { title: 'Lung Injury and Chest Trauma', file: 'Lung Injury and Chest Trauma.pdf' },
            { title: 'Mechanical Ventilation Basics', file: 'Mechanical Ventilation Basics.pdf' },
            { title: 'Myocardial Infarction', file: 'Myocardial Infarction.pdf' },
            { title: 'Pulmonary Embolism', file: 'Pulmonary Embolism.pdf' },
            { title: 'Respiratory Failure', file: 'Respiratory Failure.pdf' },
            { title: 'Shock Lecture', file: 'Shock Lecture.pdf' },
            { title: 'Triage Lecture', file: 'Triage Lecture.pdf' },
            { title: 'Pain Management', file: '🩺 Pain Management.pdf' },
            { title: 'Acid Base Imbalance and ABG', file: 'Acid base imbalance and ABG.pdf' },
            { title: 'Acute Respiratory Distress Syndrome', file: 'Acute Respiratory Distress Syndrome.pdf' },
            { title: 'Cardiac Dysrhythmia', file: 'Cardiac Dysrhythmia.pdf' },
            { title: 'Cardiac Surgery', file: 'Cardiac Surgery.pdf' },
            { title: 'Code Management', file: 'code managment.pdf' },
          ], flashcards: [], mcq: [
            { title: 'اسئلة مقالي', file: 'اسئله مقالي .pdf' },
            { title: 'اسئلة مقالي ORAL نظري', file: 'اسئله مقالي ORAL نظري .pdf' },
            { title: 'مقالي بالإجابات', file: 'مقالي بي الاجبات.pdf' },
            { title: 'Critical Care Nursing', file: 'Critical Care Nursing.pdf' },
            { title: 'Question Bank - Critical Care and Emergency Nursing', file: 'Question bank critical care and emergency nursing.pdf' },
            { title: 'Question Bank - Critical Care (الأصلي)', file: 'Question bank critical care الاصلي.pdf' },
            { title: 'Question Bank - Critical Care', file: 'Question bank critical care.pdf' },
          ] } },
        { name: 'Medicine', slug: 'medicine', desc: 'Core medical concepts and internal medicine', icon: '💊', files: { lectures: [
            { title: 'Acute Viral Hepatitis', file: 'Acute Viral Hepatitis(1).pdf' },
            { title: 'Acute Renal Failure', file: 'Acute-Renal-Failure-ARF-Essential-Nursing-Guide[1].pdf' },
            { title: 'Angina Pectoris', file: 'Angina Pectoris.pdf' },
            { title: 'Arrhythmia', file: 'Arrhythmia[1].pdf' },
            { title: 'Bowel Habit Disorders', file: 'Bowel Habit Disorders[1].pdf' },
            { title: 'Chronic Liver Disease', file: 'Chronic liver disease[1].pdf' },
            { title: 'Chronic Renal Failure', file: 'Chronic_Renal_Failure[1].pdf' },
            { title: 'Diabetes Mellitus', file: 'Diabetes Mellitus[1].pdf' },
            { title: 'Heart Failure', file: 'Heart_Failure_Lecture (1).pdf' },
            { title: 'Hypertension', file: 'Hypertension[1].pdf' },
            { title: 'Hyperthyroidism', file: 'Hyperthyroidism[1].pdf' },
            { title: 'Hypothyroidism', file: 'Hypothyroidism[1].pdf' },
            { title: 'Liver Transplant', file: 'Liver_Transplant_45_Slides.pdf' },
            { title: 'Myocardial Infarction', file: 'Myocardial Infarction.pdf' },
            { title: 'Nephrotic Syndrome', file: 'Nephrotic Syndrome (1).pdf' },
            { title: 'Peptic Ulcer Disease', file: 'Peptic ulcer disease.pdf' },
            { title: 'Respiratory Failure', file: 'Respiratory failure.pdf' },
            { title: 'Rheumatic Fever', file: 'Rheumatic_Fever_Lecture_for_Nursing_Students (1).pdf' },
          ], summaries: [
            { title: 'Acute Renal Failure', file: 'Acute Renal Failure.pdf' },
            { title: 'Acute Viral Hepatitis', file: 'Acute Viral Hepatitis.pdf' },
            { title: 'Arrhythmia', file: 'Arrhythmia.pdf' },
            { title: 'Bowel Habit Disorders', file: 'Bowel Habit Disorders.pdf' },
            { title: 'Chronic Renal Failure', file: 'Chronic Renal Failure.pdf' },
            { title: 'Chronic Liver Disease', file: 'Chronic liver disease.pdf' },
            { title: 'Diabetes Mellitus', file: 'Diabetes Mellitus.pdf' },
            { title: 'Heart Failure', file: 'Heart Failure.pdf' },
            { title: 'Hypertension', file: 'Hypertension.pdf' },
            { title: 'Hyperthyroidism', file: 'Hyperthyroidism.pdf' },
            { title: 'Hypothyroidism', file: 'Hypothyroidism.pdf' },
            { title: 'Nephrotic Syndrome', file: 'Nephrotic Syndrome.pdf' },
            { title: 'Peptic Ulcer Disease', file: 'Peptic Ulcer Disease.pdf' },
            { title: 'Rheumatic Fever', file: 'Rheumatic Fever.pdf' },
          ], flashcards: [
            { title: 'Differential Diagnosis Flashcards', file: 'dif.pdf' },
          ], mcq: [
            { title: 'Question Bank', file: 'Question Bank ااا.pdf' },
            { title: 'مقالي', file: 'مقالي .pdf' },
          ] } },
        { name: 'Pathology', slug: 'pathology', desc: 'Disease mechanisms and pathological processes', icon: '🧫', files: { lectures: [
            { title: 'Neoplasia 2', file: 'Neoplasia2.pdf' },
            { title: 'Repair Nursing', file: 'Repair Nursing.pdf' },
            { title: 'Thrombosis Nursing', file: 'Thrombosis nursing.pdf' },
            { title: 'Cell Injury', file: 'Cell Injury.pdf' },
            { title: 'Chronic Inflammation', file: 'Chronic inflammation.pdf' },
            { title: 'Hemodynamic', file: 'Heomdynamic.pdf' },
            { title: 'Inflammation', file: 'inflammation.pdf' },
            { title: 'Neoplasia', file: 'Neoplasia.pdf' },
          ], summaries: [
            { title: 'Healing and Repair', file: 'Healing and Repair.pdf' },
            { title: 'Hemodynamic 2', file: 'Heomdynamic2.pdf' },
            { title: 'Inflammation', file: 'Inflammation.pdf' },
            { title: 'Neoplasia 1', file: 'Neoplasia1.pdf' },
            { title: 'Neoplasia 2', file: 'NEOPLASIA2.pdf' },
            { title: 'Thrombosis Nursing', file: 'Thrombosis nursing.pdf' },
            { title: 'Cell Injury', file: 'Cell Injury.pdf' },
            { title: 'Chronic Inflammation', file: 'Chronic Inflammation.pdf' },
          ], flashcards: [
            { title: 'Pathology Examination 2', file: 'Pathology Examination2.pdf' },
            { title: 'Pathology Examination 4', file: 'Pathology Examination4.pdf' },
            { title: 'Pathology Examination 5', file: 'Pathology Examination5.pdf' },
            { title: 'Pathology Examination 6', file: 'Pathology Examination6.pdf' },
            { title: 'Pathology Final Examination 1', file: 'Pathology Final Examination 1.pdf' },
            { title: 'Pathology Final Examination 3', file: 'Pathology Final Examination 3.pdf' },
            { title: 'Neoplasia Examination 7', file: 'Neoplasia Examination 7.pdf' },
          ], mcq: [
            { title: 'اسئلة مقالي باثو', file: 'اسئله مقالي باثو.pdf' },
            { title: 'Pathology', file: 'pathology.pdf' },
            { title: 'Question Bank', file: 'Question bank.pdf' },
          ] } },
        { name: 'Pharmacology', slug: 'pharmacology', desc: 'Drug classifications, actions, and nursing implications', icon: '💉', files: { lectures: [
            { title: 'Lecture 1 & 2', file: 'lec1and2.pdf' },
            { title: 'Lecture 3', file: 'lec3.pdf' },
            { title: 'Lecture 4', file: 'lec4.pdf' },
            { title: 'Lecture 5', file: 'lec5.pdf' },
            { title: 'Lecture 6', file: 'lec6.pdf' },
            { title: 'Lecture 7', file: 'lec7.pdf' },
          ], summaries: [
            { title: 'Lecture 1', file: 'lec1.pdf' },
            { title: 'Lecture 2', file: 'lec2.pdf' },
            { title: 'Lecture 3', file: 'lec3.pdf' },
            { title: 'Lecture 4', file: 'lec4.pdf' },
            { title: 'Lecture 5', file: 'lec5.pdf' },
            { title: 'Lecture 6', file: 'lec6.pdf' },
            { title: 'Lecture 7', file: 'lec7.pdf' },
          ], flashcards: [], mcq: [
            { title: 'Lecture 1 & 2', file: 'lec1and2.pdf' },
            { title: 'Lecture 3', file: 'lec3.pdf' },
            { title: 'Lecture 4', file: 'lec4.pdf' },
            { title: 'Lecture 5', file: 'lec5.pdf' },
            { title: 'Lecture 6', file: 'lec6.pdf' },
            { title: 'Lecture 7', file: 'lec7.pdf' },
            { title: 'بنك أسئلة مترجم', file: 'بنك اسئله مترجم.pdf' },
          ] } },
        { name: 'Technical Writing', slug: 'technical-writing', desc: 'Scientific and professional writing skills for nurses', icon: '✍️', files: { lectures: [
            { title: 'Lecture 1', file: '01) Technical Writing.pdf' },
            { title: 'Lecture 2', file: '02) Technical Writing.pdf' },
            { title: 'Lecture 3', file: '03) Technical Writing.pdf' },
            { title: 'Lecture 4', file: '04) Technical Writing.pdf' },
            { title: 'Lecture 5', file: '05) Technical Writing.pdf' },
            { title: 'Lecture 6', file: '06) Technical Writing (2).pdf' },
            { title: 'Lecture 7', file: '07) Technical Writing.pdf' },
            { title: 'Lecture 8', file: '08) Technical Writing.pdf' },
          ], summaries: [
            { title: 'Lecture 2', file: '02) Technical Writing.pdf' },
            { title: 'Lecture 3', file: '03) Technical Writing.pdf' },
            { title: 'Lecture 4', file: '04) Technical Writing.pdf' },
            { title: 'Lecture 5', file: '05) Technical Writing.pdf' },
            { title: 'Lecture 6', file: '06) Technical Writing (2).pdf' },
            { title: 'Lecture 7', file: '07) Technical Writing.pdf' },
            { title: 'Lecture 8', file: '08) Technical Writing.pdf' },
          ], flashcards: [
            { title: 'Key Essay Questions', file: 'Key Essay Questions for Technical Writing and Documentation.pdf' },
            { title: 'مقالي Technical Writing', file: 'مقالي Technical Writing.pdf' },
          ], mcq: [] } },
      ],
      term2: [
        { name: 'Adult Health Nursing 2', slug: 'adult-health-nursing-2', desc: 'Advanced adult health nursing and complex care', icon: '🏥', files: { lectures: [
            { title: 'Hepatitis', file: '3- Hepatitis.pdf' },
            { title: 'Rheumatoid Arthritis', file: '3- Rheumatoid arthritis.pdf' },
            { title: 'Liver Cirrhosis & Esophageal Varices', file: '4- Liver cirrhosis esophageal varices.pdf' },
            { title: 'Osteomyelitis and Osteoporosis', file: 'Osteomyelitis and Osteoporosis.pdf' },
            { title: 'Burns', file: 'burn second term.pdf' },
            { title: 'Disc Prolapse', file: 'Disc prolapse.pdf' },
            { title: 'Endocrine - Dr. Zinab 1', file: 'endocrine dr zinab1.pdf' },
            { title: 'Endocrine System Disorders 2', file: 'Endocrine system disorders 2.pdf' },
            { title: 'Endocrine System Disorders 3', file: 'Endocrine system disorders 3.pdf' },
            { title: 'Epilepsy', file: 'epilepsy.pdf' },
            { title: 'Fibromyalgia', file: 'Fibromyalgia.pdf' },
            { title: 'Immune System - Dr. Zinab', file: 'immune system dr Zinab.pdf' },
            { title: 'Urinary System Disorders 0', file: 'urinary system disorders 0.pdf' },
            { title: 'Urinary System Disorders 1', file: 'urinary system disorders 1.pdf' },
            { title: 'Urology System Disorders 2', file: 'urology system disorders 2.pdf' },
            { title: 'Urology System Disorders 3', file: 'urology system disorders3.pdf' },
            { title: 'Peptic Ulcer', file: '1- Peptic ulcer.pdf' },
            { title: 'Fracture', file: '1-Fracture.pdf' },
            { title: 'Cholecystitis and Cholelithiasis', file: 'Cholecystitisa and Cholelithiasis.pdf' },
            { title: 'Hip Replacement', file: '2-Hip replacement.pdf' },
          ], summaries: [
            { title: 'Endocrine & Diabetes', file: 'endocrine_diabetes_lecture.html' },
            { title: 'Endocrine', file: 'endocrine_lecture.html' },
            { title: 'Adrenal Disorders', file: 'adrenal_disorders_lecture.html' },
            { title: 'Immune System', file: 'immune_system_lecture.html' },
            { title: 'Urology', file: 'urology_lecture.html' },
            { title: 'Acute Renal Failure', file: 'Acute Renal Failure.html' },
            { title: 'CKD & Urology', file: 'CKD_Urology_Lecture.html' },
            { title: 'Burns', file: 'burn_lecture_bilingual.html' },
          ], flashcards: [
            { title: 'Thyroid Disorders & Diabetes Mellitus', file: 'Thyroid Disorders and Diabetes Mellitus.html' },
            { title: 'Urology System Disorders', file: 'Urology System Disorders.html' },
            { title: 'Acute Renal Failure', file: 'Acute Renal Failure.html' },
            { title: 'Endocrine & Urology', file: 'Endocrine and Urology.html' },
            { title: 'Immune System & Burns', file: 'Immune System and Burns.html' },
          ], mcq: [
            { title: 'Question Bank - Dr. Zinab', file: 'QuestionBank_DrZinab_AnswerKey.pdf' },
            { title: 'Question Bank - د.برديس', file: 'questions bank د.برديس.pdf' },
            { title: 'اختبر نفسك - برديس', file: 'QuestionBank_برديس اختبر نفسك.html' },
          ] } },
        { name: 'Critical Care Nursing 2', slug: 'critical-care-nursing-2', desc: 'Advanced critical care nursing and interventions', icon: '❤️‍🔥', files: { lectures: [
            { title: 'Hypertensive Crisis', file: 'Hypertensive Crisis.pdf' },
            { title: 'Increased Intracranial Pressure (ICP) 2', file: 'Increased Intracranial Pressure (ICp) 2.pdf' },
            { title: 'Liver Dialysis', file: 'Liver Dialysis.pdf' },
            { title: 'Liver Transplantation', file: 'Liver Transplantation.pdf' },
            { title: 'Myasthenia Gravis', file: 'mytheniagraves .pdf' },
            { title: 'Nutritional Support for Critically Ill Patients', file: 'Nutritional support for critically ill patients.pdf' },
            { title: 'Renal Transplantation', file: 'Renal Transplantation.pdf' },
            { title: 'Seizure', file: 'Seizure.pdf' },
            { title: 'Stroke', file: 'Stroke.pdf' },
            { title: 'Thyroid Crisis', file: 'Thyroid Crisis.pdf' },
            { title: 'Bacterial Meningitis', file: 'Bacterial meningitis.pdf' },
            { title: 'Craniotomy', file: 'Craniotomy.pdf' },
            { title: 'DKA', file: 'DKA.pdf' },
            { title: 'Hematology', file: 'Hematology.pdf' },
            { title: 'Hepatic Encephalopathy', file: 'Hepatic Encephalopathy.pdf' },
          ], summaries: [
            { title: 'Hepatic Encephalopathy', file: 'Hepatic_Encephalopathy_lecture.html' },
            { title: 'Hypertensive Crisis', file: 'hypertensive_crisis_bilingual.html' },
            { title: 'Increased ICP', file: 'ICP_Lecture_Bilingual.html' },
            { title: 'Liver Dialysis', file: 'liver_dialysis_bilingual.html' },
            { title: 'Liver Transplantation', file: 'liver_transplantation_bilingual.html' },
            { title: 'Myasthenia Gravis', file: 'myasthenia_gravis_lecture.html' },
            { title: 'Nutritional Support', file: 'nutrition_support_tabs.html' },
            { title: 'Renal Transplantation', file: 'Renal_Transplantation_Lecture.html' },
            { title: 'Seizure', file: 'seizure_lecture.html' },
            { title: 'Stroke', file: 'Stroke_Lecture.html' },
            { title: 'Thyroid Crisis', file: 'thyroid_crisis_bilingual.html' },
            { title: 'Bacterial Meningitis', file: 'Bacterial_Meningitis_Bilingual.html' },
            { title: 'Craniotomy', file: 'Craniotomy_Lecture (2).html' },
            { title: 'DIC', file: 'DIC_Lecture.html' },
            { title: 'DKA', file: 'DKA_lecture.html' },
          ], flashcards: [
            { title: 'مراجعة للشفوي', file: 'مراجعة_الشفوي_للطباعة.pdf' },
          ], mcq: [
            { title: 'Bank Critical 2', file: 'bank critical 2.pdf' },
            { title: 'اختبر نفسك - Critical Care', file: 'bank criticalاختبر نفسك.html' },
          ] } },
        { name: 'Critical Care Medicine', slug: 'critical-care-medicine', desc: 'Medical management of critically ill patients', icon: '🫀', files: { lectures: [
            { title: 'Acute Coronary Syndrome', file: 'Acute coronary syndrome pdf.pdf' },
            { title: 'Acute Respiratory Distress Syndrome', file: 'Acute Respiratory Distress Syndrom.pdf' },
            { title: 'Angina', file: 'Angina pdf.pdf' },
            { title: 'Arrhythmias', file: 'Arrhythmias pdf_compressed (1).pdf' },
            { title: 'Basic Mechanical', file: 'Basic mechanical.pdf' },
            { title: 'DIC', file: 'DIC pdf.pdf' },
            { title: 'DKA', file: 'DKA pdf.pdf' },
            { title: 'GIT Bleeding', file: 'GIT bleeding pdf_compressed.pdf' },
            { title: 'Head Injury and ICP', file: 'Head injury and icp pdf.pdf' },
            { title: 'Hemodynamic Monitoring', file: 'Hemodynamic monitoring.pdf' },
            { title: 'Hepatic Encephalopathy', file: 'Hepatic encephalopathy pdf_compressed.pdf' },
            { title: 'HTN Emergency', file: 'HTN emergency.pdf' },
            { title: 'Organ Transplantation', file: 'organ transplantation pdf .pdf' },
            { title: 'Respiratory Failure', file: 'Respiratory Failure 2_113547.pdf' },
            { title: 'Shock', file: 'Shock pdf.pdf' },
            { title: 'Stroke', file: 'stroke pdf.pdf' },
            { title: 'Thyroid Crisis', file: 'thyroid crisis pdf.pdf' },
          ], summaries: [], flashcards: [
            { title: 'HTN Summary', file: 'htn_summary.html' },
            { title: 'Ventilator', file: 'lec1_ventilator.html' },
            { title: 'DIC', file: 'lec2_dic.html' },
            { title: 'DKA', file: 'lec3_dka.html' },
            { title: 'Neurology, Cardiovascular & Gastroenterology', file: 'Neurology, Cardiovascula,Gastroenterology.html' },
            { title: 'Organ Transplantation', file: 'organ_transplantation.pdf' },
            { title: 'Respiratory Failure', file: 'respiratory_failure.pdf' },
            { title: 'Shock', file: 'shock.pdf' },
            { title: 'Stroke', file: 'stroke_poster.html' },
            { title: 'Thyroid Emergency', file: 'thyroid_emergency_.html' },
            { title: 'ACS', file: 'ACS_poster.html' },
            { title: 'Angina', file: 'angina_poster (1).html' },
            { title: 'ARDS', file: 'ARDS_Poster.html' },
            { title: 'Arrhythmias', file: 'Arrhythmias_Poster.html' },
            { title: 'Hepatic Encephalopathy', file: 'hepatic_encephalopathy_poster.html' },
          ], mcq: [
            { title: 'Critical Care Quiz', file: 'critical_care_quiz (3).html' },
            { title: 'ICU Practice Exam', file: 'ICU_Practice_Exam.pdf' },
            { title: 'Insulin Dose Quiz', file: 'insulin_dose_quiz_v2.html' },
            { title: 'إجابات الأسئلة المقالي', file: 'اجبات الاسئله المقالي.pdf' },
            { title: 'مراجعة الفويس', file: 'مراجعه الفويس.pdf' },
            { title: 'Combined Quiz', file: 'combined_quiz.html' },
            { title: 'Critical Care MCQ', file: 'Critical_Care_MCQ.pdf' },
            { title: 'Critical Care MCQ Bank', file: 'Critical_Care_MCQ_Bank.html' },
            { title: 'Critical Care MCQ على الأسئلة المقالي', file: 'Critical_Care_MCQعلى الاسئله المقالي.pdf' },
          ] } },
        { name: 'General Surgery', slug: 'general-surgery', desc: 'Surgical procedures and perioperative nursing care', icon: '🩻', files: { lectures: [
            { title: 'Breast Cancer', file: 'Breast Cancer.pdf' },
            { title: 'Cholecystectomy & Thyroidectomy', file: 'Cholecystectomy Thyroidectomy.pdf' },
            { title: 'Haemorrhoids', file: 'Haemorrhoids.pdf' },
            { title: 'Orthopedic Surgery', file: 'Orthopedic Surgery.pdf' },
            { title: 'Principles of Cardiothoracic Surgery', file: 'Principles of Cardiothoracic Surgery.pdf' },
            { title: 'Shock & Haemorrhage', file: 'Shock Haemorrhage.pdf' },
            { title: 'Surgical Management of Cancer Patients', file: 'Surgical Management of Cancer Patients.pdf' },
            { title: 'Wounds & Wound Infection', file: 'Wounds Wound Infection.pdf' },
            { title: 'Abdominal Hernia', file: 'ABDOMINAL HERNIA.pdf' },
            { title: 'Acute Appendicitis & Intestinal Obstruction', file: 'ACUTE APPENDICITIS INTESTINAL OBSTRUCTION.pdf' },
          ], summaries: [], flashcards: [], mcq: [
            { title: 'Question Bank', file: 'Q. Bank.pdf' },
          ] } },
        { name: 'Teaching Strategies', slug: 'teaching-strategies', desc: 'Methods and approaches for patient and nursing education', icon: '📋', files: { lectures: [
            { title: 'Teaching & Learning', file: 'Teaching_Learning.pdf' },
            { title: 'Bloom\'s Taxonomy', file: 'Blooms_Taxonomy.pdf' },
            { title: 'Interactive Teaching Strategies', file: 'Interactive_Teaching_Strategies.pdf' },
            { title: 'Modern Teaching Strategies', file: 'Modern_Teaching_Strategies_.pdf' },
            { title: 'Traditional Teaching Methods', file: 'Traditional_Teaching_Methods.pdf' },
            { title: 'Technologies of Teaching', file: 'Technologies of Teaching.pdf' },
            { title: 'AI in Nursing Education', file: 'Artificial Intelegence in_Nursing_Education.pdf' },
          ], summaries: [
            { title: 'Teaching & Learning', file: 'teaching_learning_lecture.html' },
            { title: 'Technologies of Teaching', file: 'Technologies_of_Teaching_Bilingual.html' },
            { title: 'Traditional Teaching Methods', file: 'Traditional_Teaching_Methods.html' },
            { title: 'Bloom\'s Taxonomy', file: 'blooms_taxonomy_lecture.html' },
            { title: 'Interactive Teaching Strategies', file: 'interactive_teaching_strategies.html' },
            { title: 'Modern Teaching Strategies', file: 'Modern_Teaching_Strategies_Ch3.html' },
          ], flashcards: [], mcq: [
            { title: 'Question Bank - Teaching & Learning', file: 'Question_Bank_Teaching_Learning(1).pdf' },
            { title: 'Teaching & Learning (الأكمل)', file: 'Teaching_Learning الاكمل.pdf' },
            { title: 'Teaching & Learning مقالي', file: 'Teaching_Learning مقالي.pdf' },
            { title: 'Teaching & Learning Quiz', file: 'Teaching_Learning_Quiz(1).pdf' },
            { title: 'Traditional Teaching Methods Quiz', file: 'Traditional_Teaching_ Methods Quiz(1).pdf' },
            { title: 'Question Bank Teaching', file: 'question_bank teaching.html' },
          ] } },
        { name: 'Communication Skills', slug: 'communication-skills', desc: 'Therapeutic communication and interpersonal skills', icon: '🗣️', files: { lectures: [
            { title: 'Communication 1', file: 'Communication1.pdf' },
            { title: 'Communication 2', file: 'Communication 2.pdf' },
            { title: 'Communication 3', file: 'Communication3 .pdf' },
            { title: 'Communication 4', file: 'Communication 4.pdf' },
            { title: 'Communication Skills 5', file: 'Communication Skills 5.pdf' },
            { title: 'Listening and Study Skills', file: 'Listening and Study Skills.pdf' },
            { title: 'Body Language and Public Speaking', file: 'Body Language and Public Speaking.pdf' },
          ], summaries: [
            { title: 'Communication Skills', file: 'communication_skills_bilingual.html' },
            { title: 'Communication Lecture 2', file: 'communication_lecture2.html' },
            { title: 'Communication Lecture 4', file: 'communication_lecture4.html' },
            { title: 'Communication Lecture 5', file: 'lecture5_communication.html' },
            { title: 'Barriers of Communication', file: 'barriers_of_communication.html' },
            { title: 'Body Language', file: 'body_language_lecture.html' },
            { title: 'Listening & Study Skills', file: 'listening_study_skills_lecture7.html' },
          ], flashcards: [
            { title: 'كومي', file: 'كومي.pdf' },
          ], mcq: [
            { title: 'Communication Quiz', file: 'communication_quiz (1).html' },
          ] } },
      ]
    }
  },
  y3: {
    title: 'Third Year',
    badge: 'Year 03',
    badgeStyle: 'background:rgba(216,90,48,0.18);color:#B14C26;',
    desc: 'Advanced clinical practice, specializations, and nursing research',
    color: 'rgba(216,90,48,0.18)',
    termLabels: { term1: 'Maternity & Obstetric Nursing', term2: 'Pediatric Nursing' },
    terms: {
      term1: [
        { name: 'Maternal Health Nursing 1 (Theoretical)', slug: 'maternal-health-nursing-1-theoretical', desc: 'Theoretical foundations of maternal and antenatal nursing care', icon: '🤰', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'Maternal Health Nursing 1 (Practical)', slug: 'maternal-health-nursing-1-practical', desc: 'Practical sessions for maternal and antenatal nursing care', icon: '🩺', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'Obstetric Medicine and Midwifery', slug: 'obstetric-medicine-and-midwifery', desc: 'Medical and midwifery aspects of pregnancy and childbirth', icon: '👶', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'Informatics and Technology in Nursing', slug: 'informatics-and-technology-in-nursing', desc: 'Use of informatics and technology in nursing practice', icon: '💻', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'Scientific Research in Nursing', slug: 'scientific-research-in-nursing', desc: 'Research methods and methodology applied to nursing', icon: '🔬', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'Principles of Statistics', slug: 'principles-of-statistics', desc: 'Foundations of statistics for healthcare research', icon: '📊', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'English Writing', slug: 'english-writing-3', desc: 'Theoretical English writing skills', icon: '✍️', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
      ],
      term2: [
        { name: 'Pediatric Nursing (Theoretical)', slug: 'pediatric-nursing-theoretical', desc: 'Theoretical foundations of pediatric nursing care', icon: '🧒', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'Pediatric Nursing (Practical)', slug: 'pediatric-nursing-practical', desc: 'Practical sessions for pediatric nursing care', icon: '🩹', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'Pediatric Medicine', slug: 'pediatric-medicine', desc: 'Medical management of pediatric patients', icon: '💉', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'Pediatric Surgery', slug: 'pediatric-surgery', desc: 'Surgical conditions and care in pediatric patients', icon: '🔪', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'Evidence-Based Nursing Practice', slug: 'evidence-based-nursing-practice', desc: 'Applying research evidence to nursing practice', icon: '📑', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'Advanced English Writing', slug: 'advanced-english-writing', desc: 'Advanced theoretical English writing skills', icon: '✍️', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
        { name: 'University Requirement', slug: 'university-requirement', desc: 'University-mandated general requirement course', icon: '🏛️', files: { lectures: [], summaries: [], flashcards: [], mcq: [] } },
      ]
    }
  }
};

let currentYear = null;
let currentTerm = 'term1';

// ─── PRACTICAL SUBJECTS (separate per term) ───
// Each subject has 3 resource types: lecture (شرح), procedure (الإجراء), video (فيديو تعليمي)
// Files live under: files/<yearKey>/practical/<termKey>/<subject-slug>/<lecture|procedure|video>/yourfile
const practicalSubjects = {
  y2: {
    term1: [
      { name: 'Adult 1', slug: 'adult-1', desc: 'Practical training for Adult Health Nursing 1', icon: '🩺', files: { lecture: [
          { title: 'Med-Surg I Clinical Book 2025', file: 'Med-Surg I clinical book 2025.pdf' },
          { title: 'Labs Summary Table', file: '🧪 LAPS SUMMARY TABLE.pdf' },
          { title: 'Oral Questions', file: 'اسئله oral.pdf' },
          { title: 'Equipment', file: 'equipment.pdf' },
        ], procedure: [
          { title: 'ECG', file: 'ECG.pdf' },
          { title: 'Blood Transfusion', file: 'Blood transfusion.pdf' },
          { title: 'Surgical Hand Washing', file: 'Surgical hand washing.pdf' },
          { title: 'IV Infusion', file: 'IV infusion.pdf' },
        ], video: [] } },
      { name: 'Critical 1', slug: 'critical-1', desc: 'Practical training for Critical Care Nursing 1', icon: '❤️‍🔥', files: { lecture: [
          { title: 'Critical Care and Emergency Clinical Book (Last Version)', file: 'Critical care and Emergency clinical book last version.pdf' },
          { title: 'Oral Practical Questions', file: 'اسئله oral عملي.pdf' },
          { title: 'Chest Tube', file: 'Chest tube.pdf' },
        ], procedure: [
          { title: 'Central Venous Pressure (CVP)', file: 'Central Venous Pressure CVP.pdf' },
          { title: 'Chest Tube Dressing Care', file: 'Chest Tube Dressing Care.pdf' },
          { title: 'Chest Tube', file: 'Chest tube.pdf' },
          { title: 'Equipment', file: 'equipment.pdf' },
          { title: 'D.C Shock', file: 'd.c shock.pdf' },
          { title: 'Oropharyngeal Airway', file: 'Oropharyngeal Airway.pdf' },
          { title: 'ABG', file: 'ABG.pdf' },
          { title: 'BLS', file: 'BLS.pdf' },
        ], video: [] } },
    ],
    term2: [
      { name: 'Adult 2', slug: 'adult-2', desc: 'Practical training for Adult Health Nursing 2', icon: '🩺', files: { lecture: [
          { title: 'Medical Surgical Second Term Clinical Book', file: 'medical surgical second term clinical book (1)rst (1).pdf' },
          { title: 'Medical Surgical Second Term Clinical Book (2)', file: 'medical surgical second term clinical book (1)rst (1) (1).pdf' },
          { title: 'Hemodialysis & Liver Dialysis', file: 'hemodialysis & liver dialysis.pdf' },
          { title: 'Check Lists Adult II — All Procedures', file: 'check lists adult II all procedures.pdf' },
          { title: 'Renal Biopsy', file: 'Renal Biopsy.pdf' },
          { title: 'Lumbar Puncture', file: 'Lumbar Puncture.pdf' },
          { title: 'Traction Care', file: 'Traction Care.pdf' },
          { title: 'Colostomy Care and Colostomy Irrigation', file: 'Colostomy Care and Colostomy Irrigation.pdf' },
          { title: 'Cast Care', file: 'Cast Care.pdf' },
          { title: 'Burn Wound Care', file: 'Burn Wound Care.pdf' },
        ], procedure: [
          { title: 'Check List Adult', file: 'Check List adult.pdf' },
          { title: 'Equipment', file: 'equipment.pdf' },
          { title: 'Adult Procedures Photos', file: 'صور الادالت عملي .pdf' },
          { title: 'Medical Procedures — Theory & Practical', file: 'medical_procedures نظري العملي.html' },
          { title: 'Nursing Procedures Equipment', file: 'nursing_procedures_equipment.html' },
        ], video: [] } },
      { name: 'Critical 2', slug: 'critical-2', desc: 'Practical training for Critical Care Nursing 2', icon: '❤️‍🔥', files: { lecture: [
          { title: 'Critical Care Nursing — Explanation', file: 'Critical Care Nursingشرح.html' },
          { title: 'Critical — Theory & Practical', file: 'critical نظري العملي.html' },
          { title: 'Critical 2 Checklist', file: 'critical 2 checklist.pdf' },
          { title: 'Critical Care and Emergency Clinical Book — Part 1', file: 'Critical care and Emergency clinical book part one last version.pdf' },
          { title: 'Critical Care Nursing Practice — Part 2', file: 'Critical Care Nursing Practice part 2 final version.pdf' },
          { title: 'Mechanical Ventilator', file: 'Mechanical Ventilator.pdf' },
          { title: 'Total Parenteral Nutrition', file: 'Total Parenteral Nutrition.pdf' },
          { title: 'Tracheostomy Care', file: 'Tracheostomy Care.pdf' },
          { title: 'Bundles of Care of Critically Ill Patients', file: 'Bundles of Care of Critically Ill Patients.pdf' },
        ], procedure: [
          { title: 'Critical Equipment', file: 'Critical Equipment.html' },
          { title: 'Critical Procedures', file: 'Critical procedures.html' },
          { title: 'ACLS Checklist', file: 'ACLS_Checklist.html' },
          { title: 'ACLS Equipment', file: 'ACLS_Equipment.html' },
          { title: 'Critical Procedures Photos', file: 'صور كريتيكال عملي .pdf' },
          { title: 'Photos', file: 'صور.pdf' },
          { title: 'Equipment', file: 'equipment.pdf' },
          { title: 'Critical 2 Checklist', file: 'critical 2 checklist.pdf' },
        ], video: [] } },
    ]
  }
};

/* ══════════════════════ GLOBAL SEARCH ══════════════════════ */
function buildSearchIndex() {
  const index = [];
  Object.keys(years).forEach(yearKey => {
    const y = years[yearKey];
    ['term1', 'term2'].forEach(term => {
      (y.terms[term] || []).forEach(s => {
        index.push({
          name: s.name, icon: s.icon, color: y.color,
          yearKey, term, yearTitle: y.title,
          termLabel: (y.termLabels && y.termLabels[term]) || (term === 'term1' ? 'Term 1' : 'Term 2'),
          type: 'subject', slug: s.slug,
        });
      });
    });
    const yp = practicalSubjects[yearKey] || {};
    ['term1', 'term2'].forEach(term => {
      (yp[term] || []).forEach(s => {
        index.push({
          name: s.name, icon: s.icon, color: 'rgba(8,18,15,0.55)',
          yearKey, term, yearTitle: y.title,
          termLabel: (y.termLabels && y.termLabels[term]) || (term === 'term1' ? 'Term 1' : 'Term 2'),
          type: 'practical', slug: s.slug,
        });
      });
    });
  });
  return index;
}

let searchIndexCache = null;
function getSearchIndex() {
  if (!searchIndexCache) searchIndexCache = buildSearchIndex();
  return searchIndexCache;
}

function handleSearch(query) {
  const resultsEl = document.getElementById('searchResults');
  const clearBtn = document.getElementById('searchClearBtn');
  clearBtn.classList.toggle('show', query.length > 0);

  const q = query.trim().toLowerCase();
  if (!q) {
    resultsEl.classList.remove('open');
    resultsEl.innerHTML = '';
    return;
  }

  const matches = getSearchIndex().filter(item => item.name.toLowerCase().includes(q)).slice(0, 8);

  if (!matches.length) {
    const safeQuery = query.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    resultsEl.innerHTML = `<div class="search-empty">No subjects match "${safeQuery}"</div>`;
  } else {
    resultsEl.innerHTML = matches.map(m => `
      <div class="search-result-item" onclick="goToSearchResult('${m.yearKey}','${m.term}','${m.type}','${escapeForJs(m.slug)}')">
        <div class="search-result-icon" style="background:${m.color};">${m.icon}</div>
        <div class="search-result-text">
          <div class="search-result-name">${m.name}</div>
          <div class="search-result-meta">${m.yearTitle} · ${m.termLabel}</div>
        </div>
      </div>
    `).join('');
  }
  resultsEl.classList.add('open');
}

function goToSearchResult(yearKey, term, type, slug) {
  clearSearch();
  openYear(yearKey, term);
  // wait a tick so renderSubjects() / practical grid have rendered
  setTimeout(() => {
    if (type === 'practical') {
      const list = (practicalSubjects[yearKey] || {})[term] || [];
      const idx = list.findIndex(s => s.slug === slug);
      if (idx > -1) openPracticalSubject(idx);
    } else {
      const list = years[yearKey].terms[term] || [];
      const idx = list.findIndex(s => s.slug === slug);
      if (idx > -1) openSubject(idx);
    }
  }, 0);
}

function clearSearch() {
  const input = document.getElementById('globalSearch');
  input.value = '';
  document.getElementById('searchClearBtn').classList.remove('show');
  document.getElementById('searchResults').classList.remove('open');
  document.getElementById('searchResults').innerHTML = '';
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrap')) {
    document.getElementById('searchResults').classList.remove('open');
  }
});

function openPractical() {
  document.getElementById('yearView').classList.remove('active');
  document.getElementById('subjectView').classList.remove('active');

  const yearPractical = practicalSubjects[currentYear] || {};
  const list = yearPractical[currentTerm] || [];

  document.getElementById('practicalTitle').textContent = 'Practical Subjects — ' + (currentTerm === 'term1' ? 'Term 1' : 'Term 2');
  document.getElementById('practicalDesc').textContent = 'Practical sessions for ' + (currentTerm === 'term1' ? 'Term 1' : 'Term 2') + ' — lectures, procedures & instructional videos';

  document.getElementById('practicalGrid').innerHTML = list.map((s, i) => {
    const prog = subjectProgress(s, `files/${currentYear}/practical/${currentTerm}/${s.slug}`);
    return `
    <div class="subject-card" onclick="openPracticalSubject(${i})">
      <div class="subject-icon" style="background:rgba(255,255,255,0.5); font-size:20px;">${s.icon}</div>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <div class="resource-types">
        <span class="res-tag lectures">Lecture</span>
        <span class="res-tag procedure">Procedure</span>
        <span class="res-tag video">Video</span>
      </div>
      ${progressBarHtml(prog)}
    </div>`;
  }).join('');

  renderBreadcrumb('practicalBreadcrumb', [
    { label: 'Home', action: 'goHome()' },
    { label: years[currentYear].title, action: `openYear('${currentYear}','${currentTerm}')` },
    { label: 'Practical Subjects' },
  ]);

  document.getElementById('practicalView').classList.add('active');
  window.scrollTo({ top: document.querySelector('.main').offsetTop - 20, behavior: 'smooth' });
}

function backToYearFromPractical() {
  document.getElementById('practicalView').classList.remove('active');
  document.getElementById('yearView').classList.add('active');
}

let subjectBackAction = backToYearFromPracticalDefault;
function backToYearFromPracticalDefault() {
  document.getElementById('subjectView').classList.remove('active');
  document.getElementById('yearView').classList.add('active');
}

function openPracticalSubject(idx) {
  const yearPractical = practicalSubjects[currentYear] || {};
  const list = yearPractical[currentTerm] || [];
  const s = list[idx];

  document.getElementById('practicalView').classList.remove('active');
  document.getElementById('subjectTitle').textContent = s.name;
  document.getElementById('subjectDesc').textContent = years[currentYear].title + ' · Practical · ' + (currentTerm === 'term1' ? 'Term 1' : 'Term 2') + ' · ' + s.desc;

  subjectBackAction = () => {
    document.getElementById('subjectView').classList.remove('active');
    openPractical();
  };

  renderBreadcrumb('subjectBreadcrumb', [
    { label: 'Home', action: 'goHome()' },
    { label: years[currentYear].title, action: `openYear('${currentYear}','${currentTerm}')` },
    { label: 'Practical Subjects', action: 'subjectBackAction()' },
    { label: s.name },
  ]);

  const resources = [
    { key: 'lecture', icon: '📖', label: 'Lecture', desc: 'Explanatory lecture for the practical topic', color: '#1D9E75' },
    { key: 'procedure', icon: '🛠️', label: 'Procedure', desc: 'Step-by-step procedure / skill checklist', color: '#BA7517' },
    { key: 'video', icon: '🎥', label: 'Video', desc: 'Instructional video for the procedure', color: '#D4537E' },
  ];

  const basePath = `files/${currentYear}/practical/${currentTerm}/${s.slug}`;
  renderResourceGrid(resources, s, basePath);

  document.getElementById('subjectView').classList.add('active');
  window.scrollTo({ top: document.querySelector('.main').offsetTop - 20, behavior: 'smooth' });
}

function openYear(yearKey, term) {
  currentYear = yearKey;
  currentTerm = term || 'term1';
  const y = years[yearKey];
  document.getElementById('homeSection').classList.add('hidden');
  document.getElementById('subjectView').classList.remove('active');
  document.getElementById('practicalView').classList.remove('active');

  document.getElementById('yearBadge').textContent = y.badge;
  document.getElementById('yearBadge').style.cssText = y.badgeStyle + 'font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:4px 12px;border-radius:100px;';
  document.getElementById('yearTitle').textContent = y.title;
  document.getElementById('yearDesc').textContent = y.desc;

  document.getElementById('termTabs').innerHTML = `
    <button class="term-tab ${currentTerm === 'term1' ? 'active' : ''}" onclick="switchTerm('term1')">${(y.termLabels && y.termLabels.term1) || 'Term 1'}</button>
    <button class="term-tab ${currentTerm === 'term2' ? 'active' : ''}" onclick="switchTerm('term2')">${(y.termLabels && y.termLabels.term2) || 'Term 2'}</button>
  `;

  renderBreadcrumb('yearBreadcrumb', [
    { label: 'Home', action: 'goHome()' },
    { label: y.title },
  ]);

  renderSubjects();

  document.getElementById('yearView').classList.add('active');
  window.scrollTo({ top: document.querySelector('.main').offsetTop - 20, behavior: 'smooth' });
}

function switchTerm(term) {
  currentTerm = term;
  const y = years[currentYear];

  document.querySelectorAll('.term-tab').forEach(btn => btn.classList.remove('active'));
  document.getElementById('termTabs').innerHTML = `
    <button class="term-tab ${currentTerm === 'term1' ? 'active' : ''}" onclick="switchTerm('term1')">${(y.termLabels && y.termLabels.term1) || 'Term 1'}</button>
    <button class="term-tab ${currentTerm === 'term2' ? 'active' : ''}" onclick="switchTerm('term2')">${(y.termLabels && y.termLabels.term2) || 'Term 2'}</button>
  `;

  renderSubjects();
}

function renderSubjects() {
  const y = years[currentYear];
  const subjects = y.terms[currentTerm];
  const grid = document.getElementById('subjectsGrid');

  let html = subjects.map((s, i) => {
    const prog = subjectProgress(s, `files/${currentYear}/${currentTerm}/${s.slug}`);
    return `
    <div class="subject-card" onclick="openSubject(${i})">
      <div class="subject-icon" style="background:${y.color}; font-size:20px;">${s.icon}</div>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <div class="resource-types">
        <span class="res-tag lectures">Lectures</span>
        <span class="res-tag summaries">Summaries</span>
        <span class="res-tag flashcards">Flashcards</span>
        <span class="res-tag mcq">MCQ Bank</span>
      </div>
      ${progressBarHtml(prog)}
    </div>`;
  }).join('');

  // "Practical Subjects" hub — shown first, before all subjects, in both terms
  const yearPractical = practicalSubjects[currentYear] || {};
  const termPractical = yearPractical[currentTerm] || [];
  if (termPractical.length) {
    let practicalSeen = 0, practicalTotal = 0;
    termPractical.forEach(s => {
      const p = subjectProgress(s, `files/${currentYear}/practical/${currentTerm}/${s.slug}`);
      practicalSeen += p.seen; practicalTotal += p.total;
    });
    const practicalCard = `
      <div class="subject-card practical-card" onclick="openPractical()">
        <div class="subject-icon" style="font-size:20px;">🧪</div>
        <h3>Practical Subjects</h3>
        <p>${currentTerm === 'term1' ? 'Adult 1 & Critical 1' : 'Adult 2 & Critical 2'} practical sessions</p>
        <div class="resource-types">
          <span class="res-tag lectures">Lecture</span>
          <span class="res-tag procedure">Procedure</span>
          <span class="res-tag video">Video</span>
        </div>
        ${progressBarHtml({ seen: practicalSeen, total: practicalTotal })}
      </div>`;
    html = practicalCard + html;
  }

  grid.innerHTML = html;
}

function openSubject(idx) {
  const y = years[currentYear];
  const s = y.terms[currentTerm][idx];

  document.getElementById('yearView').classList.remove('active');
  document.getElementById('subjectTitle').textContent = s.name;
  document.getElementById('subjectDesc').textContent = y.title + ' · ' + ((y.termLabels && y.termLabels[currentTerm]) || (currentTerm === 'term1' ? 'Term 1' : 'Term 2')) + ' · ' + s.desc;

  subjectBackAction = () => {
    document.getElementById('subjectView').classList.remove('active');
    document.getElementById('yearView').classList.add('active');
  };

  renderBreadcrumb('subjectBreadcrumb', [
    { label: 'Home', action: 'goHome()' },
    { label: y.title, action: `openYear('${currentYear}','${currentTerm}')` },
    { label: s.name },
  ]);

  const resources = [
    { key: 'lectures', icon: '📖', label: 'Lectures', desc: 'Full lecture slides and notes', color: '#1D9E75' },
    { key: 'summaries', icon: '📄', label: 'Summaries', desc: 'Condensed study summaries', color: '#378ADD' },
    { key: 'flashcards', icon: '🃏', label: 'Flashcards', desc: 'Quick review flash cards', color: '#BA7517' },
    { key: 'mcq', icon: '✅', label: 'MCQ Bank', desc: 'Practice multiple choice questions', color: '#D4537E' },
  ];

  const basePath = `files/${currentYear}/${currentTerm}/${s.slug}`;
  renderResourceGrid(resources, s, basePath, true);

  document.getElementById('subjectView').classList.add('active');
  window.scrollTo({ top: document.querySelector('.main').offsetTop - 20, behavior: 'smooth' });
}

function renderResourceGrid(resources, s, basePath, withTypeClass) {
  document.getElementById('resourceGrid').innerHTML = resources.map(r => {
    const list = (s.files && s.files[r.key]) ? s.files[r.key] : [];
    const seenCount = list.filter(f => isFileViewed(`${basePath}/${r.key}/${f.file}`)).length;
    const filesHtml = list.length
      ? `<ul class="file-list">${list.map(f => {
          const url = `${basePath}/${r.key}/${f.file}`;
          const visited = isFileViewed(url);
          const favorited = isFavorited(url);
          const title = f.title || f.file;
          const meta = escapeForJs(JSON.stringify({ url, title, subject: s.name, resource: r.label }));
          return `
          <li class="file-list-item">
            <a href="${basePath}/${r.key}/${encodeURIComponent(f.file)}" target="_blank" rel="noopener" class="${visited ? 'visited' : ''}" onclick="markFileViewed('${escapeForJs(url)}', this); trackRecent('${meta}')">
              <svg class="f-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
              <span class="f-title">${title}</span>
            </a>
            <button class="fav-star ${favorited ? 'active' : ''}" type="button" title="${favorited ? 'Remove from favorites' : 'Add to favorites'}" onclick="event.stopPropagation(); toggleFavorite('${meta}', this)">
              <svg viewBox="0 0 24 24" fill="${favorited ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </button>
          </li>
        `}).join('')}</ul>`
      : `<span class="coming-soon">Coming soon</span>`;
    return `
    <div class="resource-card ${withTypeClass ? r.key : ''}" ${list.length ? 'onclick="toggleResourceCard(this)"' : ''}>
      <div class="resource-icon" style="background:${r.color}22;">${r.icon}</div>
      <h3>${r.label}${list.length ? `<span class="res-progress-badge ${seenCount === list.length ? 'done' : ''}">${seenCount}/${list.length}</span>` : ''}</h3>
      <p>${r.desc}</p>
      ${filesHtml}
    </div>`;
  }).join('');
}

function toggleResourceCard(card) {
  const wasExpanded = card.classList.contains('expanded');
  card.parentElement.querySelectorAll('.resource-card.expanded').forEach(c => {
    if (c !== card) c.classList.remove('expanded');
  });
  card.classList.toggle('expanded', !wasExpanded);
}

document.addEventListener('click', (e) => {
  // Only block propagation on the list container itself — NOT on links or buttons inside it
  if (e.target.classList.contains('file-list')) e.stopPropagation();
}, true);

/* ══════════════════════ BREADCRUMB ══════════════════════ */
function renderBreadcrumb(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = items.map((item, i) => {
    const isLast = i === items.length - 1;
    const sep = i > 0 ? `<span class="breadcrumb-sep">›</span>` : '';
    const piece = isLast || !item.action
      ? `<span class="breadcrumb-current">${item.label}</span>`
      : `<button class="breadcrumb-link" onclick="${item.action}">${item.label}</button>`;
    return `<span class="breadcrumb-item">${sep}${piece}</span>`;
  }).join('');
}

/* ══════════════════════ PROGRESS TRACKING (localStorage) ══════════════════════ */
const PROGRESS_KEY = 'nurseverse_viewed_files_v1';

function getViewedSet() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) { return new Set(); }
}

function isFileViewed(url) {
  return getViewedSet().has(url);
}

function markFileViewed(url, linkEl) {
  try {
    const set = getViewedSet();
    set.add(url);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...set]));
  } catch (e) {}
  if (linkEl) linkEl.classList.add('visited');
  // Defer the progress recalculation so it never competes with the browser
  // opening the new tab at the moment of the click (avoids felt delay/lag).
  setTimeout(refreshProgressUI, 50);
}

function escapeForJs(str) {
  // Escape for a single-quoted JS string literal, then HTML-escape the
  // result — every call site embeds this directly inside a double-quoted
  // onclick="..." attribute. Without the HTML-escape step, a raw " (e.g.
  // from a JSON.stringify'd meta object) terminates the attribute early
  // and a raw & gets parsed as an HTML entity, silently breaking the
  // handler (it throws a SyntaxError on click, so nothing inside
  // onclick runs at all — not just the part after the broken character).
  const jsEscaped = String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  return escapeForHtmlAttr(jsEscaped);
}

/* Escapes a string so it's safe to embed inside a double-quoted HTML
   attribute (e.g. onclick="..."). Must be applied AFTER escapeForJs()
   whenever the value can contain raw double quotes (like a JSON string),
   otherwise an embedded " breaks the attribute and the whole handler
   throws a SyntaxError silently on click. */
function escapeForHtmlAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ══════════════════════ FAVORITES (localStorage) ══════════════════════ */
const FAVORITES_KEY = 'nurseverse_favorites_v1';

function getFavoritesMap() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

function saveFavoritesMap(map) {
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(map)); } catch (e) {}
}

function isFavorited(url) {
  return !!getFavoritesMap()[url];
}

function toggleFavorite(metaJson, btnEl) {
  let meta;
  try { meta = JSON.parse(metaJson); } catch (e) { return; }
  const map = getFavoritesMap();
  if (map[meta.url]) {
    delete map[meta.url];
  } else {
    map[meta.url] = meta;
  }
  saveFavoritesMap(map);
  if (btnEl) {
    const nowFav = !!map[meta.url];
    btnEl.classList.toggle('active', nowFav);
    btnEl.title = nowFav ? 'Remove from favorites' : 'Add to favorites';
    const svg = btnEl.querySelector('svg');
    if (svg) svg.setAttribute('fill', nowFav ? 'currentColor' : 'none');
  }
  if (document.getElementById('favoritesView') && document.getElementById('favoritesView').classList.contains('active')) {
    renderFavoritesView();
  }
  if (document.getElementById('dashboardPanel') && document.getElementById('dashboardPanel').classList.contains('open')) {
    renderDashboardFavorites();
  }
}

/* ══════════════════════ RECENTLY VIEWED (localStorage) ══════════════════════ */
const RECENTS_KEY = 'nurseverse_recent_files_v1';
const RECENTS_MAX = 30;

function getRecentList() {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function saveRecentList(list) {
  try { localStorage.setItem(RECENTS_KEY, JSON.stringify(list)); } catch (e) {}
}

function trackRecent(metaJson) {
  let meta;
  try { meta = JSON.parse(metaJson); } catch (e) { return; }
  let list = getRecentList().filter(m => m.url !== meta.url);
  meta.ts = Date.now();
  list.unshift(meta);
  if (list.length > RECENTS_MAX) list = list.slice(0, RECENTS_MAX);
  saveRecentList(list);
  if (document.getElementById('dashboardPanel') && document.getElementById('dashboardPanel').classList.contains('open')) {
    renderDashboardRecents();
  }
}

function timeAgo(ts) {
  const diff = Math.max(0, Date.now() - ts);
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return min + 'm ago';
  const hr = Math.floor(min / 60);
  if (hr < 24) return hr + 'h ago';
  const day = Math.floor(hr / 24);
  if (day < 7) return day + 'd ago';
  return new Date(ts).toLocaleDateString();
}

function renderDashboardRecents() {
  const el = document.getElementById('dashRecentsPreview');
  if (!el) return;
  const items = getRecentList().slice(0, 5);
  if (!items.length) {
    el.innerHTML = `<p class="favorites-empty dash-fav-empty">No recent files yet — open anything and it'll show up here.</p>`;
    return;
  }
  el.innerHTML = `<ul class="file-list favorites-list dash-fav-list dash-recent-list">${items.map(meta => `
    <li class="file-list-item">
      <a href="${meta.url}" target="_blank" rel="noopener" onclick="markFileViewed('${escapeForJs(meta.url)}', this); trackRecent('${escapeForJs(JSON.stringify(meta))}')">
        <svg class="f-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
        <span class="f-title">${meta.title}<small class="fav-meta"> · ${meta.subject || ''}</small></span>
      </a>
      <span class="dash-recent-time">${timeAgo(meta.ts)}</span>
    </li>`).join('')}</ul>`;
}

function openFavorites() {
  document.getElementById('homeSection').classList.add('hidden');
  document.getElementById('yearView').classList.remove('active');
  document.getElementById('subjectView').classList.remove('active');
  document.getElementById('practicalView').classList.remove('active');
  document.getElementById('favoritesView').classList.add('active');
  renderBreadcrumb('favoritesBreadcrumb', [
    { label: 'Home', action: 'goHome()' },
    { label: 'My Favorites' },
  ]);
  renderFavoritesView();
  window.scrollTo({ top: document.querySelector('.main').offsetTop - 20, behavior: 'smooth' });
}

function renderFavoritesView() {
  const map = getFavoritesMap();
  const items = Object.values(map);
  const grid = document.getElementById('favoritesGrid');
  if (!items.length) {
    grid.innerHTML = `<p class="favorites-empty">No favorites yet — tap the ★ next to any file to save it here.</p>`;
    return;
  }
  grid.innerHTML = `<ul class="file-list favorites-list">${items.map(meta => {
    const visited = isFileViewed(meta.url);
    return `
    <li class="file-list-item">
      <a href="${meta.url}" target="_blank" rel="noopener" class="${visited ? 'visited' : ''}" onclick="markFileViewed('${escapeForJs(meta.url)}', this); trackRecent('${escapeForJs(JSON.stringify(meta))}')">
        <svg class="f-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
        <span class="f-title">${meta.title}<small class="fav-meta"> · ${meta.subject || ''}${meta.resource ? ' · ' + meta.resource : ''}</small></span>
      </a>
      <button class="fav-star active" type="button" title="Remove from favorites" onclick="event.stopPropagation(); toggleFavorite('${escapeForJs(JSON.stringify(meta))}', this)">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      </button>
    </li>`;
  }).join('')}</ul>`;
}


function subjectProgress(s, basePath) {
  let seen = 0, total = 0;
  if (s.files) {
    Object.keys(s.files).forEach(key => {
      (s.files[key] || []).forEach(f => {
        total++;
        if (isFileViewed(`${basePath}/${key}/${f.file}`)) seen++;
      });
    });
  }
  return { seen, total };
}

function progressBarHtml(prog) {
  if (!prog.total) return '';
  const pct = Math.round((prog.seen / prog.total) * 100);
  return `
    <div class="subject-progress-track" title="${prog.seen} of ${prog.total} files opened">
      <div class="subject-progress-fill" style="width:${pct}%;"></div>
    </div>`;
}

function yearProgressHtml(yearKey) {
  const y = years[yearKey];
  let seen = 0, total = 0;
  ['term1', 'term2'].forEach(term => {
    (y.terms[term] || []).forEach(s => {
      const p = subjectProgress(s, `files/${yearKey}/${term}/${s.slug}`);
      seen += p.seen; total += p.total;
    });
    const yp = practicalSubjects[yearKey] || {};
    (yp[term] || []).forEach(s => {
      const p = subjectProgress(s, `files/${yearKey}/practical/${term}/${s.slug}`);
      seen += p.seen; total += p.total;
    });
  });
  if (!total) return '';
  const pct = Math.round((seen / total) * 100);
  return `
    <div class="year-card-progress-track"><div class="year-card-progress-fill" style="width:${pct}%;"></div></div>
    <div class="year-card-progress-label">${pct}% reviewed</div>`;
}

function refreshProgressUI() {
  // Only recompute the year-card progress rings when the home screen is
  // actually visible — skip this work entirely while inside a subject/practical
  // view, since those cards aren't on screen anyway.
  const homeVisible = !document.getElementById('homeSection').classList.contains('hidden');
  if (homeVisible) {
    ['y1', 'y2', 'y3'].forEach(yk => {
      const el = document.getElementById('yearProgress-' + yk);
      if (el) el.innerHTML = yearProgressHtml(yk);
    });
  }
  if (document.getElementById('yearView').classList.contains('active')) renderSubjects();

  // Update "x/y" badges + checkmarks live inside an open subject view,
  // without re-rendering (which would collapse any expanded resource card).
  document.querySelectorAll('#resourceGrid .resource-card').forEach(card => {
    const badge = card.querySelector('.res-progress-badge');
    if (!badge) return;
    const links = card.querySelectorAll('.file-list a');
    const total = links.length;
    let seen = 0;
    links.forEach(a => { if (a.classList.contains('visited')) seen++; });
    badge.textContent = `${seen}/${total}`;
    badge.classList.toggle('done', seen === total);
  });
}

function goHome() {
  currentYear = null;
  document.getElementById('yearView').classList.remove('active');
  document.getElementById('subjectView').classList.remove('active');
  document.getElementById('practicalView').classList.remove('active');
  document.getElementById('favoritesView').classList.remove('active');
  document.getElementById('homeSection').classList.remove('hidden');
  refreshProgressUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ══════════════════════ CONTACT / FEEDBACK FORM ══════════════════════
// Sign up free at https://formspree.io with Ali's email, create a new form,
// and replace YOUR_FORM_ID below with the endpoint ID Formspree gives you.
// Example: https://formspree.io/f/abc1234
const CONTACT_FORM_ENDPOINT = 'https://formspree.io/f/xvzjkqwz';

function openContact() {
  const overlay = document.getElementById('contactOverlay');
  overlay.classList.add('open');
  // hide name field if user is logged in
  const guestWrap = document.getElementById('guestNameWrap');
  if (guestWrap) guestWrap.style.display = window._currentUserUid ? 'none' : 'block';
  // reset form
  document.getElementById('msgText').value = '';
  if (document.getElementById('msgSenderName')) document.getElementById('msgSenderName').value = '';
  const status = document.getElementById('contactStatus');
  status.classList.remove('show','ok','err');
  status.textContent = '';
  const wrap = document.getElementById('contactFormWrap');
  if (wrap) wrap.style.display = 'block';
}

function closeContact() {
  document.getElementById('contactOverlay').classList.remove('open');
}

document.getElementById('contactOverlay').addEventListener('click', (e) => {
  if (e.target.id === 'contactOverlay') closeContact();
});

async function sendMessageToAli() {
  const text = document.getElementById('msgText').value.trim();
  const status = document.getElementById('contactStatus');
  const btn = document.getElementById('msgSendBtn');
  if (!text) {
    status.textContent = '⚠️ Write your message first.';
    status.classList.add('show','err'); return;
  }
  btn.disabled = true; btn.textContent = 'Sending...';
  status.classList.remove('show','ok','err');

  // get sender info
  let senderName = window._currentUserName || '';
  let senderEmail = '';
  if (!window._currentUserUid) {
    senderName = (document.getElementById('msgSenderName')?.value.trim()) || 'Anonymous';
  }
  // build a reply object and send to Firestore via Firebase module
  if (window._sendStudentMessageToAli) {
    try {
      await window._sendStudentMessageToAli({ text, senderName, senderEmail });
      document.getElementById('contactFormWrap').style.display = 'none';
      status.textContent = '✅ Message sent! Ali will get back to you soon.';
      status.classList.add('show','ok');
    } catch(e) {
      status.textContent = '⚠️ Something went wrong. Try again.';
      status.classList.add('show','err');
      btn.disabled = false; btn.textContent = 'Send Message 🚀';
    }
  } else {
    // fallback: not logged in to Firebase yet, show a helpful message
    status.textContent = '⚠️ Please sign in first so Ali can reply to you.';
    status.classList.add('show','err');
    btn.disabled = false; btn.textContent = 'Send Message 🚀';
  }
}
window.openContact = openContact;
window.closeContact = closeContact;
window.sendMessageToAli = sendMessageToAli;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // sw.js مدمج في firebase-messaging-sw.js — التسجيل يتم في requestFCMToken()
    // FCM service worker is registered inside requestFCMToken()
  });
}

// Paint year-card progress bars on first load
refreshProgressUI();


// Ensure background video plays (fallback against autoplay restrictions)
(function ensureVideoPlays() {
  const vid = document.getElementById('bg-video');
  if (!vid) return;
  const tryPlay = () => {
    const p = vid.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        // Autoplay blocked; retry on first user interaction
        const retry = () => { vid.play(); document.removeEventListener('click', retry); document.removeEventListener('touchstart', retry); };
        document.addEventListener('click', retry, { once: true });
        document.addEventListener('touchstart', retry, { once: true });
      });
    }
  };
  if (vid.readyState >= 2) {
    tryPlay();
  } else {
    vid.addEventListener('loadeddata', tryPlay, { once: true });
  }
  window.addEventListener('load', tryPlay);

  // Recover from mid-playback freezes (buffering stalls, dropped frames, etc.)
  let stallTimer = null;
  const nudge = () => {
    clearTimeout(stallTimer);
    stallTimer = setTimeout(() => {
      if (vid.paused || vid.readyState < 2) {
        tryPlay();
      } else {
        // Still "playing" per the API but visually stuck: force a tiny seek to unstick decoding
        try {
          const t = vid.currentTime;
          if (t > 0.05) vid.currentTime = t - 0.05;
          vid.play();
        } catch (e) {}
      }
    }, 1200);
  };
  ['waiting', 'stalled', 'suspend'].forEach(evt => vid.addEventListener(evt, nudge));
  vid.addEventListener('playing', () => clearTimeout(stallTimer));
  vid.addEventListener('error', tryPlay);
})();

/* ── Auth UI Controls ── */
function openAuthModal() {
  document.getElementById('authModalOverlay').classList.add('open');
}
function closeAuthModal() {
  document.getElementById('authModalOverlay').classList.remove('open');
}
function handleAuthOverlayClick(e) {
  if (e.target === document.getElementById('authModalOverlay')) closeAuthModal();
}
function toggleUserPopover() {
  document.getElementById('userPopover').classList.toggle('open');
  if (window._authUpdateStats) window._authUpdateStats();
}
function renderDashboardFavorites() {
  const el = document.getElementById('dashFavoritesPreview');
  if (!el) return;
  const items = Object.values(getFavoritesMap());
  if (!items.length) {
    el.innerHTML = `<p class="favorites-empty dash-fav-empty">No favorites yet — tap ★ on any file to save it here.</p>`;
    return;
  }
  const preview = items.slice(-4).reverse();
  el.innerHTML = `<ul class="file-list favorites-list dash-fav-list">${preview.map(meta => `
    <li class="file-list-item">
      <a href="${meta.url}" target="_blank" rel="noopener" onclick="markFileViewed('${escapeForJs(meta.url)}', this); trackRecent('${escapeForJs(JSON.stringify(meta))}')">
        <svg class="f-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>
        <span class="f-title">${meta.title}<small class="fav-meta"> · ${meta.subject || ''}</small></span>
      </a>
      <button class="fav-star active" type="button" title="Remove from favorites" onclick="event.stopPropagation(); toggleFavorite('${escapeForJs(JSON.stringify(meta))}', this)">
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      </button>
    </li>`).join('')}</ul>
    ${items.length > 4 ? `<p class="dash-fav-more">+${items.length - 4} more in your favorites</p>` : ''}`;
}

function openDashboard() {
  if (window._authUpdateStats) window._authUpdateStats();
  renderDashboardFavorites();
  renderDashboardRecents();
  document.getElementById('dashboardPanel').classList.add('open');
}
function closeDashboard() {
  document.getElementById('dashboardPanel').classList.remove('open');
}
function handleDashboardOverlayClick(e) {
  if (e.target === document.getElementById('dashboardPanel')) closeDashboard();
}

/* Groups panel (study groups list) */
function openGroupsPanel() {
  document.getElementById('groupsPanel').classList.add('open');
  if (window._loadMyGroups) window._loadMyGroups();
  if (window._loadMyInvites) window._loadMyInvites();
}
function closeGroupsPanel() {
  document.getElementById('groupsPanel').classList.remove('open');
}
function handleGroupsOverlayClick(e) {
  if (e.target === document.getElementById('groupsPanel')) closeGroupsPanel();
}
window.openGroupsPanel = openGroupsPanel;
window.closeGroupsPanel = closeGroupsPanel;
window.handleGroupsOverlayClick = handleGroupsOverlayClick;

document.addEventListener('click', (e) => {
  if (!e.target.closest('#userAvatarWrap'))
    document.getElementById('userPopover').classList.remove('open');
});
/* ══════════════════════ NOTIFICATIONS (client-side) ══════════════════════ */
const NOTIF_KEY = 'nurseverse_notifications_v1';
const NOTIF_READ_KEY = 'nurseverse_notif_read_v1';

function getNotifications() {
  try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]'); } catch(e) { return []; }
}
function saveNotifications(list) {
  try { localStorage.setItem(NOTIF_KEY, JSON.stringify(list)); } catch(e) {}
}
function getReadSet() {
  try { return new Set(JSON.parse(localStorage.getItem(NOTIF_READ_KEY) || '[]')); } catch(e) { return new Set(); }
}
function saveReadSet(s) {
  try { localStorage.setItem(NOTIF_READ_KEY, JSON.stringify([...s])); } catch(e) {}
}

const NOTIF_TYPE_ICONS = { update:'📢', new_file:'📁', exam:'📝', info:'ℹ️', auto:'🆕' };

function countUnread() {
  const read = getReadSet();
  return getNotifications().filter(n => !read.has(n.id)).length;
}

/* Unread chat count (separate from normal notifications), kept in sync by:
   - student: updateMyChatPreview() when their conversation doc changes
   - admin:   renderConversationsList() when the live conversations list changes
   Combined with normal notifications into the single bell badge. */
window._unreadChatCount = 0;

function updateNotifBadge() {
  const n = countUnread() + (window._unreadChatCount || 0);
  const badge = document.getElementById('notifBadge');
  if (!badge) return;
  if (n > 0) {
    badge.textContent = n > 99 ? '99+' : n;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
  updateAvatarMsgBadge();
}

/* Badge shown directly on the avatar circle: reflects unread student↔admin messages only
   (not regular notifications), so the admin can spot new messages without opening anything.
   Admin-only — students don't get a badge on their own avatar for this. */
function updateAvatarMsgBadge() {
  const badge = document.getElementById('adminAvatarBadge');
  if (!badge) return;
  const isAdmin = window._currentUserEmail === (window.ADMIN_EMAIL_REF || '');
  const n = isAdmin ? (window._unreadChatCount || 0) : 0;
  if (n > 0) {
    badge.textContent = n > 99 ? '99+' : n;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}
window.updateAvatarMsgBadge = updateAvatarMsgBadge;

function renderNotifList() {
  const el = document.getElementById('notifList');
  if (!el) return;
  const notifs = getNotifications();
  if (!notifs.length) {
    el.innerHTML = '<p class="notif-empty">لا توجد إشعارات بعد 🔔</p>';
    return;
  }
  const read = getReadSet();
  el.innerHTML = notifs.slice().reverse().map(n => {
    const isRead = read.has(n.id);
    const icon = NOTIF_TYPE_ICONS[n.type] || '🔔';
    const time = timeAgo(n.ts);
    return `<div class="notif-item ${isRead ? 'read' : ''}" onclick="markNotifRead('${n.id}', this)">
      <span class="notif-dot"></span>
      <span class="notif-icon">${icon}</span>
      <div class="notif-content">
        <div class="notif-title">${n.title}</div>
        ${n.body ? `<div class="notif-body">${n.body}</div>` : ''}
        <div class="notif-time">${time}</div>
      </div>
    </div>`;
  }).join('');
}

function markNotifRead(id, el) {
  const read = getReadSet();
  read.add(id);
  saveReadSet(read);
  if (el) { el.classList.add('read'); el.querySelector('.notif-dot').style.background = 'rgba(28,43,37,0.2)'; }
  updateNotifBadge();
}

function markAllNotifsRead() {
  const read = getReadSet();
  getNotifications().forEach(n => read.add(n.id));
  saveReadSet(read);
  renderNotifList();
  updateNotifBadge();
}

function toggleNotifPanel() {
  const overlay = document.getElementById('notifPanelOverlay');
  const isOpen = overlay.classList.contains('open');
  if (isOpen) { closeNotifPanel(); }
  else {
    renderNotifList();
    overlay.classList.add('open');
    // mark all as read after 2 seconds of viewing
    setTimeout(() => markAllNotifsRead(), 2000);
  }
}
function closeNotifPanel() {
  document.getElementById('notifPanelOverlay').classList.remove('open');
}

/* Add a new notification locally and show toast */
function pushNotification(notif) {
  const list = getNotifications();
  // avoid duplicates by id
  if (list.find(n => n.id === notif.id)) return;
  list.push(notif);
  // keep max 50
  if (list.length > 50) list.splice(0, list.length - 50);
  saveNotifications(list);
  updateNotifBadge();
  showNotifToast(notif);
  // browser push notification
  requestAndShowBrowserNotif(notif);
}

function showNotifToast(notif) {
  let toast = document.getElementById('notifToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'notifToast';
    toast.className = 'notif-toast';
    toast.onclick = () => { closeNotifToast(); toggleNotifPanel(); };
    document.body.appendChild(toast);
  }
  const icon = NOTIF_TYPE_ICONS[notif.type] || '🔔';
  toast.innerHTML = `<span class="notif-toast-icon">${icon}</span>
    <div><div class="notif-toast-title">${notif.title}</div>${notif.body ? `<div class="notif-toast-body">${notif.body}</div>` : ''}</div>`;
  toast.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(closeNotifToast, 5000);
}

function closeNotifToast() {
  const t = document.getElementById('notifToast');
  if (t) t.classList.remove('show');
}

function requestAndShowBrowserNotif(notif) {
  if (!('Notification' in window)) return;
  const show = () => {
    if (Notification.permission === 'granted') {
      new Notification(notif.title, { body: notif.body || '', icon: './icon-192.png' });
    }
  };
  if (Notification.permission === 'default') {
    Notification.requestPermission().then(show);
  } else { show(); }
}

/* Admin panel */
let adminTarget = 'all'; // 'all' or 'one'
let selectedStudentUid = null;
let selectedStudentName = '';
let allStudents = [];

function openAdminPanel() {
  document.getElementById('adminOverlay').classList.add('open');
  if (window._loadStudentsList) window._loadStudentsList();
}
function closeAdminPanel() {
  document.getElementById('adminOverlay').classList.remove('open');
}

/* Separate panel: admin's student conversations (kept apart from "send notification") */
function openAdminConversationsPanel() {
  document.getElementById('adminConvOverlay').classList.add('open');
}
function closeAdminConversationsPanel() {
  document.getElementById('adminConvOverlay').classList.remove('open');
}
window.openAdminConversationsPanel = openAdminConversationsPanel;
window.closeAdminConversationsPanel = closeAdminConversationsPanel;

/* Admin: group requests panel */
function openAdminGroupsPanel() {
  document.getElementById('adminGroupsOverlay').classList.add('open');
  if (window._loadAdminGroups) window._loadAdminGroups();
}
function closeAdminGroupsPanel() {
  document.getElementById('adminGroupsOverlay').classList.remove('open');
}
window.openAdminGroupsPanel = openAdminGroupsPanel;
window.closeAdminGroupsPanel = closeAdminGroupsPanel;


/* Stats dashboard panel (kept apart from "send notification" and "conversations") */
function openAdminStatsPanel() {
  document.getElementById('adminStatsOverlay').classList.add('open');
  document.getElementById('adminStatsLoading').style.display = 'block';
  document.getElementById('adminStatsContent').style.display = 'none';
  if (window._loadAdminStats) window._loadAdminStats();
}
function closeAdminStatsPanel() {
  document.getElementById('adminStatsOverlay').classList.remove('open');
}
window.openAdminStatsPanel = openAdminStatsPanel;
window.closeAdminStatsPanel = closeAdminStatsPanel;

/* AI control panel (kept apart from stats/notifications/conversations) */
function openAdminAIPanel() {
  document.getElementById('adminAIOverlay').classList.add('open');
  document.getElementById('aiSettingsLoading').style.display = 'block';
  document.getElementById('aiSettingsContent').style.display = 'none';
  if (window._loadAISettings) window._loadAISettings();
}
function closeAdminAIPanel() {
  document.getElementById('adminAIOverlay').classList.remove('open');
}
window.openAdminAIPanel = openAdminAIPanel;
window.closeAdminAIPanel = closeAdminAIPanel;

function switchAdminTab(tab) {
  adminTarget = tab;
  document.getElementById('tabAll').classList.toggle('active', tab === 'all');
  document.getElementById('tabOne').classList.toggle('active', tab === 'one');
  document.getElementById('adminTargetOne').style.display = tab === 'one' ? 'block' : 'none';
  document.getElementById('adminSendBtn').textContent = tab === 'all' ? 'إرسال للكل 🚀' : 'إرسال للشخص ده 📨';
}

function filterStudentsList(q) {
  const filtered = q
    ? allStudents.filter(s => (s.displayName||'').toLowerCase().includes(q.toLowerCase()) || (s.email||'').toLowerCase().includes(q.toLowerCase()))
    : allStudents;
  renderStudentsListIn('adminStudentsList', filtered, true);
}

function renderStudentsListIn(elId, students, selectable) {
  const el = document.getElementById(elId);
  if (!el) return;
  if (!students.length) { el.innerHTML = '<p style="font-size:12px;color:rgba(28,43,37,0.4);text-align:center;padding:1rem;">لا يوجد طلبة</p>'; return; }
  el.innerHTML = students.map(s => {
    const initials = (s.displayName||s.email||'?').split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
    const isSelected = s.uid === selectedStudentUid;
    return `<div class="admin-student-item ${isSelected ? 'selected' : ''}" ${selectable ? `onclick="selectStudent('${s.uid}','${escAdm(s.displayName||s.email)}')"` : ''}>
      <div class="admin-student-avatar">${initials}</div>
      <div class="admin-student-info">
        <div class="admin-student-name">${s.displayName || '—'}</div>
        <div class="admin-student-email">${s.email || ''}</div>
      </div>
    </div>`;
  }).join('');
}

function escAdm(str) { return String(str||'').replace(/'/g,"\\'").replace(/"/g,'&quot;'); }

/* Renders the data computed by window._loadAdminStats() into the stats overlay */
function renderAdminStats(stats) {
  document.getElementById('adminStatsLoading').style.display = 'none';
  document.getElementById('adminStatsContent').style.display = 'block';

  document.getElementById('statTotalStudents').textContent = stats.totalStudents;
  document.getElementById('statAvgProgress').textContent   = stats.avgProgress + '%';
  document.getElementById('statActiveWeek').textContent    = stats.activeThisWeek;
  document.getElementById('statTotalOpens').textContent    = stats.totalOpens;

  const topEl = document.getElementById('adminTopSubjectsList');
  if (!stats.topSubjects.length) {
    topEl.innerHTML = '<p style="font-size:12px;color:rgba(28,43,37,0.4);text-align:center;padding:0.8rem;">لسه مفيش بيانات كفاية</p>';
  } else {
    const maxCount = stats.topSubjects[0].count || 1;
    topEl.innerHTML = stats.topSubjects.map(x => {
      const pct = Math.round((x.count / maxCount) * 100);
      return `<div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.55rem;">
        <span style="font-size:16px;flex-shrink:0;">${x.info.icon}</span>
        <div style="flex:1;min-width:0;">
          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px;">
            <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escAdm(x.info.name)}</span>
            <span style="color:rgba(28,43,37,0.5);flex-shrink:0;margin-right:6px;">${x.count}</span>
          </div>
          <div style="background:rgba(28,43,37,0.08);border-radius:6px;height:6px;overflow:hidden;">
            <div style="background:#0F6E56;height:100%;width:${pct}%;"></div>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  const yearLabels = { y1: { label: 'First Year', icon: '🟢' }, y2: { label: 'Second Year', icon: '🔵' }, y3: { label: 'Third Year', icon: '🟠' } };
  const yearEl = document.getElementById('adminYearProgressList');
  yearEl.innerHTML = Object.keys(yearLabels).map(yk => {
    const agg = stats.yearAgg[yk] || { seen: 0, total: 0 };
    const pct = agg.total ? Math.round((agg.seen / agg.total) * 100) : 0;
    return `<div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.55rem;">
      <span style="font-size:16px;flex-shrink:0;">${yearLabels[yk].icon}</span>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px;">
          <span>${yearLabels[yk].label}</span>
          <span style="color:rgba(28,43,37,0.5);">${pct}%</span>
        </div>
        <div style="background:rgba(28,43,37,0.08);border-radius:6px;height:6px;overflow:hidden;">
          <div style="background:#185FA5;height:100%;width:${pct}%;"></div>
        </div>
      </div>
    </div>`;
  }).join('');
}
window._renderAdminStats = renderAdminStats;

function selectStudent(uid, name) {
  selectedStudentUid = uid;
  selectedStudentName = name;
  document.getElementById('adminSelectedStudent').style.display = 'flex';
  document.getElementById('adminSelectedName').textContent = '👤 ' + name;
  filterStudentsList(document.getElementById('adminStudentSearch').value);
}

function clearSelectedStudent() {
  selectedStudentUid = null;
  selectedStudentName = '';
  document.getElementById('adminSelectedStudent').style.display = 'none';
  filterStudentsList(document.getElementById('adminStudentSearch').value);
}

function sendAdminNotif() {
  const title = document.getElementById('adminNotifTitle').value.trim();
  const body = document.getElementById('adminNotifBody').value.trim();
  const type = document.getElementById('adminNotifType').value;
  const status = document.getElementById('adminSendStatus');
  if (!title) { status.textContent = '⚠️ اكتب عنوان الإشعار أول'; status.style.color='#c0392b'; return; }
  if (adminTarget === 'one' && !selectedStudentUid) { status.textContent = '⚠️ اختار طالب الأول'; status.style.color='#c0392b'; return; }

  if (window._sendAdminNotifToFirestore) {
    const btn = document.getElementById('adminSendBtn');
    btn.disabled = true; btn.textContent = 'جاري الإرسال...';
    const targetUid = adminTarget === 'one' ? selectedStudentUid : null;
    window._sendAdminNotifToFirestore({ title, body, type, targetUid }).then(() => {
      status.textContent = targetUid ? `✅ وصلت لـ ${selectedStudentName}!` : '✅ وصلت للجميع!';
      status.style.color = '#0F6E56';
      document.getElementById('adminNotifTitle').value = '';
      document.getElementById('adminNotifBody').value = '';
      btn.disabled = false;
      btn.textContent = adminTarget === 'all' ? 'إرسال للكل 🚀' : 'إرسال للشخص ده 📨';
      clearSelectedStudent();
    }).catch(() => {
      status.textContent = '⚠️ حصل خطأ، حاول تاني'; status.style.color='#c0392b';
      btn.disabled = false;
      btn.textContent = adminTarget === 'all' ? 'إرسال للكل 🚀' : 'إرسال للشخص ده 📨';
    });
  }
}

window.toggleNotifPanel = toggleNotifPanel;
window.closeNotifPanel = closeNotifPanel;
window.markAllNotifsRead = markAllNotifsRead;
window.markNotifRead = markNotifRead;
window.pushNotification = pushNotification;
window.updateNotifBadge = updateNotifBadge;
window.openAdminPanel = openAdminPanel;
window.closeAdminPanel = closeAdminPanel;
window.sendAdminNotif = sendAdminNotif;
window.switchAdminTab = switchAdminTab;
window.filterStudentsList = filterStudentsList;
window.selectStudent = selectStudent;
window.clearSelectedStudent = clearSelectedStudent;
window.renderStudentsListIn = renderStudentsListIn;
window.renderNotifList = renderNotifList;
window.getNotifications = getNotifications;
window.saveNotifications = saveNotifications;
window.showNotifToast = showNotifToast;

/* ══════════════════════ CHAT (student-facing UI) ══════════════════════ */
function escChat(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function chatBubbleHtml(messages, opts) {
  opts = opts || {};
  if (!messages.length) return '<p class="chat-empty">لسه مفيش رسايل. ابعت أول رسالة! 👋</p>';
  return messages.map(m => {
    const fromMe = m.sender === 'student';
    const time = new Date(m.ts || Date.now()).toLocaleString('ar-EG', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
    // who is allowed to delete this specific bubble in this view
    const canDelete = opts.isAdmin ? true : (m.sender === 'student');
    const delBtn = (canDelete && m.id)
      ? `<button class="chat-bubble-del-btn" title="حذف الرسالة" onclick="event.stopPropagation(); ${opts.deleteFn}('${m.id}')">🗑</button>`
      : '';
    return `<div class="chat-bubble-row ${fromMe ? 'from-me' : 'from-them'}">
      <div class="chat-bubble-wrap">
        ${delBtn}
        <div class="chat-bubble">${escChat(m.text)}<div class="chat-bubble-time">${time}</div></div>
      </div>
    </div>`;
  }).join('');
}

function openMyChat() {
  closeNotifPanel();
  closeContact();
  document.getElementById('myChatView').classList.add('open');
  const inputRow = document.getElementById('myChatInputRow');
  const msgsEl = document.getElementById('myChatMessages');
  if (!window._currentUserUid) {
    inputRow.style.display = 'none';
    msgsEl.innerHTML = `<div class="chat-signin-prompt">سجّل دخولك الأول عشان تتواصل مع علي وتفضل المحادثة محفوظة ليك<br>
      <button onclick="closeMyChat(); document.getElementById('signInBtn').click();">سجّل دخول</button></div>`;
    return;
  }
  inputRow.style.display = 'flex';
  if (window._listenMyConversation) {
    window._listenMyConversation((messages) => {
      msgsEl.innerHTML = chatBubbleHtml(messages, { isAdmin: false, deleteFn: 'deleteMyMessage' });
      msgsEl.scrollTop = msgsEl.scrollHeight;
    });
  }
  if (window._markMyChatRead) window._markMyChatRead();
}

function deleteMyMessage(msgId) {
  if (!window._deleteMyMessage) return;
  if (!confirm('تمسح الرسالة دي؟')) return;
  window._deleteMyMessage(msgId).catch((e) => {
    console.error('deleteMyMessage failed:', e);
    alert('مش قادر أمسح الرسالة دلوقتي: ' + (e && e.message ? e.message : e));
  });
}
window.deleteMyMessage = deleteMyMessage;

function closeMyChat() {
  document.getElementById('myChatView').classList.remove('open');
}

function sendMyChatMessage() {
  const input = document.getElementById('myChatInput');
  const text = input.value.trim();
  if (!text || !window._sendMyMessage) return;
  const btn = document.getElementById('myChatSendBtn');
  input.disabled = true; btn.disabled = true;
  window._sendMyMessage(text).then(() => {
    input.value = ''; input.disabled = false; btn.disabled = false; input.focus();
  }).catch(() => { input.disabled = false; btn.disabled = false; });
}

/* update the small badge/preview in the notif panel "my chat" entry */
function updateMyChatPreview(lastMessage, unread) {
  const sub = document.getElementById('myChatPreview');
  const badge = document.getElementById('myChatBadge');
  if (sub && lastMessage) sub.textContent = lastMessage.length > 38 ? lastMessage.slice(0,38)+'…' : lastMessage;
  if (badge) {
    if (unread > 0) { badge.style.display = 'flex'; badge.textContent = unread > 9 ? '9+' : unread; }
    else badge.style.display = 'none';
  }
  window._unreadChatCount = unread > 0 ? 1 : 0;
  if (window.updateNotifBadge) window.updateNotifBadge();
}

window.openMyChat = openMyChat;
window.closeMyChat = closeMyChat;
window.sendMyChatMessage = sendMyChatMessage;
window.updateMyChatPreview = updateMyChatPreview;

/* ══════════════════════ CHAT (admin-facing UI) ══════════════════════ */
let _adminChatUid = null;

function renderConversationsList(list) {
  const el = document.getElementById('adminConversationsList');
  if (!el) return;
  if (!list.length) {
    el.innerHTML = '<p style="font-size:12px;color:rgba(28,43,37,0.4);text-align:center;padding:1rem;">لسه مفيش محادثات</p>';
    _applyAdminConvUnreadCount(0);
    return;
  }
  let totalUnread = 0;
  el.innerHTML = list.map(c => {
    const initials = (c.studentName || c.studentEmail || '?').split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
    const unread = !!c.unreadByAdmin;
    if (unread) totalUnread++;
    const time = c.lastTs ? timeAgo(c.lastTs) : '';
    return `<div class="conv-list-item ${unread ? 'unread' : ''}" onclick="openAdminConversation('${c.uid}','${escAdm(c.studentName||c.studentEmail||'؟')}','${escAdm(c.studentEmail||'')}')">
      <div class="admin-student-avatar">${initials}</div>
      <div class="conv-list-info">
        <div class="conv-list-name">${c.studentName || '—'}</div>
        <div class="conv-list-last">${escChat(c.lastMessage || '')}</div>
      </div>
      <div class="conv-list-meta">
        <span class="conv-list-time">${time}</span>
        ${unread ? `<span class="conv-unread-dot">●</span>` : ''}
      </div>
    </div>`;
  }).join('');
  _applyAdminConvUnreadCount(totalUnread);
}

/* Push the admin's total unread-conversation count into the inbox label,
   the dashboard-drawer badge, and the global bell badge. */
function _applyAdminConvUnreadCount(totalUnread) {
  const countEl = document.getElementById('inboxUnreadCount');
  if (countEl) countEl.textContent = totalUnread;
  const bellBadge = document.getElementById('adminConvBadge');
  if (bellBadge) {
    if (totalUnread > 0) { bellBadge.style.display = 'flex'; bellBadge.textContent = totalUnread > 9 ? '9+' : totalUnread; }
    else bellBadge.style.display = 'none';
  }
  window._unreadChatCount = totalUnread;
  if (window.updateNotifBadge) window.updateNotifBadge();
}

function openAdminConversation(uid, name, email) {
  _adminChatUid = uid;
  document.getElementById('adminChatName').textContent = name;
  document.getElementById('adminChatEmail').textContent = email;
  document.getElementById('adminChatAvatar').textContent = (name||'?').split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
  document.getElementById('adminChatView').classList.add('open');
  const msgsEl = document.getElementById('adminChatMessages');
  msgsEl.innerHTML = '<p class="chat-empty">جاري تحميل المحادثة...</p>';
  if (window._listenAdminConversation) {
    window._listenAdminConversation(uid, (messages) => {
      msgsEl.innerHTML = chatBubbleHtml(messages, { isAdmin: true, deleteFn: 'deleteAdminChatMessage' });
      msgsEl.scrollTop = msgsEl.scrollHeight;
    });
  }
  if (window._markConversationReadByAdmin) window._markConversationReadByAdmin(uid);
}

function deleteAdminChatMessage(msgId) {
  if (!_adminChatUid || !window._deleteAdminMessage) return;
  if (!confirm('تمسح الرسالة دي؟')) return;
  window._deleteAdminMessage(_adminChatUid, msgId).catch((e) => {
    console.error('deleteAdminChatMessage failed:', e);
    alert('مش قادر أمسح الرسالة دلوقتي: ' + (e && e.message ? e.message : e));
  });
}
window.deleteAdminChatMessage = deleteAdminChatMessage;

function closeAdminChat() {
  document.getElementById('adminChatView').classList.remove('open');
  if (window._stopAdminConversationListener) window._stopAdminConversationListener();
  _adminChatUid = null;
}

function sendAdminChatMessage() {
  const input = document.getElementById('adminChatInput');
  const text = input.value.trim();
  if (!text || !_adminChatUid || !window._sendAdminChatMessage) return;
  const btn = document.getElementById('adminChatSendBtn');
  input.disabled = true; btn.disabled = true;
  window._sendAdminChatMessage(_adminChatUid, text).then(() => {
    input.value = ''; input.disabled = false; btn.disabled = false; input.focus();
  }).catch(() => { input.disabled = false; btn.disabled = false; });
}

window.renderConversationsList = renderConversationsList;
window.openAdminConversation = openAdminConversation;
window.closeAdminChat = closeAdminChat;
window.sendAdminChatMessage = sendAdminChatMessage;

// init badge on load
updateNotifBadge();


window.refreshProgressUI = refreshProgressUI;
window.subjectProgress = subjectProgress;
window.years = years;
window.practicalSubjects = practicalSubjects;
window.getFavoritesMap = getFavoritesMap;
window.saveFavoritesMap = saveFavoritesMap;
window.getRecentList = getRecentList;
window.saveRecentList = saveRecentList;
window.renderDashboardFavorites = renderDashboardFavorites;
window.renderDashboardRecents = renderDashboardRecents;
window.renderFavoritesView = renderFavoritesView;
/* ── expose core action functions so the Firebase module can intercept them ── */
window.markFileViewed = markFileViewed;
window.toggleFavorite = toggleFavorite;
window.trackRecent = trackRecent;

