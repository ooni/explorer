export interface MeasurementMeta {
  input: string | null
  measurement_start_time: string
  measurement_uid: string
  report_id: string
  test_name: string
  test_start_time: string
  probe_asn: number
  probe_cc: string
  anomaly: boolean
  confirmed: boolean
  failure: boolean
}

// Subset of the columns returned by /api/v1/observations (obs_web) that the
// viewer actually reads. The full row is kept around untyped via the index
// signature so raw inspection stays possible.
export interface WebObservation {
  measurement_uid: string
  report_id: string
  measurement_start_time: string
  test_name: string
  probe_asn: number
  probe_cc: string
  probe_as_org_name: string

  resolver_ip: string
  resolver_asn: number
  resolver_as_org_name: string

  observation_idx: number
  target_id: string | null
  hostname: string | null
  transaction_id: number | null

  ip: string | null
  port: number | null
  ip_asn: number | null
  ip_as_org_name: string | null
  ip_cc: string | null
  ip_is_bogon: boolean | null

  dns_query_type: string | null
  dns_failure: string | null
  dns_engine: string | null
  dns_engine_resolver_address: string | null
  dns_answer_type: string | null
  dns_answer: string | null
  dns_answer_asn: number | null
  dns_answer_as_org_name: string | null
  dns_t: number | null

  tcp_failure: string | null
  tcp_success: boolean | null
  tcp_t: number | null

  tls_failure: string | null
  tls_server_name: string | null
  tls_version: string | null
  tls_cipher_suite: string | null
  tls_is_certificate_valid: boolean | null
  tls_end_entity_certificate_subject_common_name: string | null
  tls_end_entity_certificate_issuer_common_name: string | null
  tls_handshake_time: number | null
  tls_t: number | null

  http_request_url: string | null
  http_failure: string | null
  http_request_method: string | null
  http_response_status_code: number | null
  http_response_body_length: number | null
  http_response_header_location: string | null
  http_runtime: number | null
  http_t: number | null

  [key: string]: unknown
}

export interface CtrlGroundTruthEntry {
  hostname: string
  ip: string
  port: number | null
  asn: number | null
  as_org_name: string | null
  is_cloud_provider: boolean
  in_dns_answers: boolean
  tls_consistent: boolean
  tcp_success_count: number
  tcp_failure_count: number
  tls_success_count: number
  tls_failure_count: number
  dns_success_count: number
  dns_nxdomain_count: number
  dns_other_failure_count: number
}

export interface AggregationEntry {
  observation_count: number
  failure: string | null
  timestamp: string | null
  hostname?: string | null
  probe_asn?: number | null
}
