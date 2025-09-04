// Canonical API Type Definitions (derived from PROJECT_API_INTEGRATION.md sections 19–21)
// NOTE: Keep this file in sync with CHANGELOG updates in the spec document.

// ========== Core / Common ==========
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export function isApiError(x: unknown): x is ApiError {
  return !!x && typeof x === 'object' && 'statusCode' in x && 'error' in x;
}

// Generic paginated named-collection response (e.g. { courses: Course[], pagination: {...} })
export type PaginatedCollection<K extends string, T> = Record<K, T[]> & { pagination: Pagination } & {
  // optional filters bag
  filters?: Record<string, any>;
};

// ========== Auth / User ==========
export interface UserPublic {
  id: string;
  email: string;
  login: string;
  roles: string[]; // ['user','teacher','admin','owner']
  avatarUrl?: string | null;
  isBlocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ========== Categories ==========
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  short_description?: string | null;
  icon?: string | null;
  image_url?: string | null;
  color?: string | null;
  parent_id?: string | null;
  isActive?: boolean;
  isFeatured?: boolean;
  order?: number;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[];
  courses_count?: number;
  students_count?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryListResponse {
  categories: Category[];
  total: number;
}

// ========== Difficulty Levels ==========
export interface DifficultyLevel {
  id: string;
  name: string;
  slug: string;
  code: string;
  level?: number;
  color?: string;
  description?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DifficultyLevelListResponse {
  levels: DifficultyLevel[];
  total: number;
}

// ========== Subjects ==========
export interface StudyMaterial {
  id: string;
  type: 'video' | 'pdf' | 'zip' | 'link' | string; // allow forward-compatible
  title: string;
  url?: string | null;
  fileId?: string | null;
  description?: string | null;
}

export interface Subject {
  id: string;
  name: string;
  description?: string | null;
  studyMaterials?: StudyMaterial[];
  createdAt?: string;
  updatedAt?: string;
}

// GET /subjects returns Subject[] directly

// ========== Courses ==========
export interface CourseSubjectLink {
  subjectId: string;
  teacherId?: string | null;
  startDate?: string | null; // ISO
}

export interface Course {
  id: string;
  title: string;
  description?: string | null;
  categoryId?: string | null;
  difficultyLevelId?: string | null;
  price?: number | null; // human UAH (current model)
  isPublished?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  courseSubjects?: CourseSubjectLink[];
  studentsCount?: number;
  startDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseListResponse extends PaginatedCollection<'courses', Course> {}

// ========== Teachers ==========
export interface TeacherSummary {
  id: string;
  userId?: string;
  fullName?: string; // aggregated from name/second_name if provided
  headline?: string | null;
  bio?: string | null;
  subjects?: string[]; // names array
  rating?: number;
  coursesCount?: number;
  studentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
  status?: string; // pending/approved/blocked etc.
}

export interface TeacherListResponse extends PaginatedCollection<'teachers', TeacherSummary> {}

export interface TeacherApplicationsResponse extends PaginatedCollection<'applications', { id: string; email: string; approvalStatus: string; createdAt?: string; updatedAt?: string; }> {}

// ========== Subscription Plans ==========
export type PlanPeriodType = '1_month' | '3_months' | '6_months' | '12_months' | string;

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  period_type: PlanPeriodType;
  // Temporary compatibility: some admin UI still uses numeric periodDays; keep optional until backend unified
  periodDays?: number | null;
  price: number; // human UAH (spec examples) or minor later (watch CHANGELOG)
  currency: string;
  discount_percent?: number;
  original_price?: number;
  is_active?: boolean;
  is_popular?: boolean;
  is_featured?: boolean;
  features?: string[];
  benefits?: string[];
  color?: string | null;
  icon?: string | null;
  sort_order?: number;
  subscribers_count?: number;
  total_revenue?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionPlanListResponse extends PaginatedCollection<'plans', SubscriptionPlan> {}

// ========== Subscriptions ==========
export type SubscriptionStatus = 'pending' | 'active' | 'cancelled' | 'expired' | 'completed' | string;

export interface Subscription {
  id: string;
  user?: string; // userId
  course?: string | null; // courseId if course-based
  status: SubscriptionStatus;
  price?: number | null; // human UAH
  paidAmount?: number | null; // human UAH or partial
  subscription_type?: string; // monthly / yearly etc.
  start_date?: string | null;
  end_date?: string | null;
  auto_renewal?: boolean;
  enrolledBy?: string; // self/admin
  enrolledAt?: string;
  next_billing_date?: string | null;
  cancellation_reason?: string | null;
  cancelled_at?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionListResponse extends PaginatedCollection<'subscriptions', Subscription> {
  filters?: Record<string, any>;
}

// ========== Payments ==========
export type PaymentStatus = 'created' | 'processing' | 'success' | 'canceled' | 'failure' | 'expired' | string;

export interface Payment {
  id: string;
  invoiceId: string;
  status: PaymentStatus;
  amount: number; // minor units currently
  currency: string;
  subscriptionId: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  statusDescription?: string; // sometimes provided alongside
}

// ========== Utility Money Formatting ==========
export function formatMoney(value: number, source: 'human' | 'minor' = 'human', fractionDigits = 2): string {
  if (source === 'minor') {
    return (value / 100).toFixed(fractionDigits);
  }
  return value.toFixed(fractionDigits);
}

// ========== DTOs (Create/Update minimal) ==========
export interface CreateCourseDto {
  title: string;
  description?: string | null;
  categoryId?: string | null;
  difficultyLevelId?: string | null;
  startDate?: string | null;
  maxStudents?: number | null;
  mainTeacherId?: string | null;
  price?: number | null; // human
}

export type UpdateCourseDto = Partial<CreateCourseDto>;

export interface CreateSubjectDto {
  name: string; // spec uses both name/title variants; adopting 'name' per examples
  description?: string | null;
}
export type UpdateSubjectDto = Partial<CreateSubjectDto>;

export interface CreateSubscriptionDto {
  planId: string;
  userId?: string;
  startDate?: string | null;
}

export interface CreatePaymentDto {
  subscriptionId: string;
  amount: number; // human
  currency: 'UAH' | 'USD' | 'EUR';
  description: string;
  redirectUrl?: string | null;
}

// ========== Migration Notes ==========
// 1. Replace ad-hoc interfaces inside api layer with these exported ones.
// 2. Remove generic normalization that guesses collection keys once all endpoints aligned.
// 3. Watch CHANGELOG for format shifts (e.g., money -> minor units universal).
// 4. Subjects endpoint currently returns Subject[] directly (no wrapper) — handle separately.
