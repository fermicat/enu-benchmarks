/**
 * Ported from eos-mechainics by quantumcat
 * 
 * 从 eos 的 eos-mechaincs 合约移植过来
 * 
 * */

#include <enulib/enu.hpp>
//#include <enulib/print.hpp>
#include <math.h>
#pragma precision=log10l(ULLONG_MAX)/2
typedef enum { FALSE=0, TRUE=1 } BOOL;

// Max when calculating primes in cpu test
#define CPU_PRIME_MAX 375

// Number of rows to write/read in ram test
#define RAM_ROWS 75

class benchbp_contract : public enumivo::contract {
    public:
        benchbp_contract(account_name self)
        :enumivo::contract(self),
        ramdata(_self, _self)
        {}

        /**
         * Simple ENU CPU benchmark that calculates Mersenne prime numbers.
         */
        void cpu() {
            // Only let us run this
            require_auth(_self);

            const int counter = CPU_PRIME_MAX;
            int p;

            //enumivo::print_f("Mersenne primes:\n");
            for (p = 2; p <= counter; p += 1) {
                if(is_prime(p) && is_mersenne_prime(p)) {
                    //enumivo::print_f(" %u", p);
                }
            }
        }

        /**
         * Simple ENU RAM benchmark which reads and writes a table.
         */
        void ram() {
            // Only let us run this
            require_auth(_self);

            int i;

            // Write
            for (i = 0; i < RAM_ROWS; i++) {
                ramdata.emplace(_self, [&](auto& row) {
                    row.id = i;
                    row.one = "qcat";
                });
            }

            // Read
            for (const auto& row: ramdata) {
                //enumivo::print_f("read %d: %s\n", row.id, row.one);
                i = row.id;
            }

            // Delete
            for(auto itr = ramdata.begin(); itr != ramdata.end();) {
                itr = ramdata.erase(itr);
            }
        }

        /**
         * Simple ENU Net benchmark which just accepts any string passed in.
         */
        void net(std::string input) {
            // Only let us run this
            require_auth(_self);
        }

    private:

        BOOL is_prime(int p) {
            if (p == 2) {
                return TRUE;
            } else if (p <= 1 || p % 2 == 0) {
                return FALSE;
            }

            BOOL prime = TRUE;
            const int to = sqrt(p);
            int i;
            for (i = 3; i <= to; i += 2) {  
                if (!((prime = BOOL(p)) % i)) break;
            }
            return prime;
        }
      
        BOOL is_mersenne_prime(int p) {
            if (p == 2) return TRUE;

            const long long unsigned m_p = (1LLU << p) - 1;
            long long unsigned s = 4;
            int i;
            for (i = 3; i <= p; i++) {
                s = (s * s - 2) % m_p;
            }
            return BOOL(s == 0);
        }

        // @abi table ramdata i64
        struct ramdata {
            uint64_t id;
            std::string one;

            auto primary_key()const { return id; }
            ENULIB_SERIALIZE(ramdata, (id)(one))
        };

        typedef enumivo::multi_index<N(ramdata), ramdata> ramdata_table;
        ramdata_table ramdata;

};

ENUMIVO_ABI(benchbp_contract, (cpu)(ram)(net))
